import React, { useEffect, useState } from 'react'
import { Button, DatePicker, Form, Input, Popconfirm, Select, Upload } from 'antd'
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { errorMes, loadingMes, successMes } from '../../Message/Message';
import { deleteDriver, updateDriver } from '../../../services/DriverService';
import dayjs from 'dayjs';
import { getBase64 } from '../../../utils';
import { Option } from 'antd/es/mentions';
import { useSelector } from 'react-redux';


const DriverInformation = (props) => {
  const { driver, access_token, refetch } = props
  const user = useSelector((state) => state.user)
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState();
  const [avatarFile, setIAvatarFile] = useState();

  const mutation = useMutation(
    {
      mutationFn: (data) => {
        const { id, access_token, ...rest } = data
        return updateDriver(id, access_token, rest)
      },
      onSuccess: (data) => {
        successMes(data?.message)
        refetch()
      },
      onError: (data) => {
        errorMes(data?.response?.data?.message)
      }
    }
  )


  const onFinish = (values) => {
    let data = {}
    if (values.email !== driver?.user?.email) data = { ...data, email: values.email }
    if (values.name !== driver?.user?.name) data = { ...data, name: values.name }
    if (values.phone !== driver?.user?.phone) data = { ...data, phone: values.phone }

    if (values.citizenId !== driver?.citizenId) data = { ...data, citizenId: values.citizenId }
    if (values.address !== driver?.address) data = { ...data, address: values.address }
    if (values.licenseType !== driver?.licenseType) data = { ...data, licenseType: values.licenseType }
    if (values.dateOfBirth.format('YYYY-MM-DD') !== dayjs(driver?.user?.dateOfBirth).format('YYYY-MM-DD')) data = { ...data, dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD') }
    if (values.gender !== driver?.user?.gender) data = { ...data, gender: values.gender }
    if (avatarFile) data = { ...data, avatar: avatarFile }

    if (Object.keys(data).length > 0) {
      data = { ...data, userId: driver.user.id }
      mutation.mutate({ ...data, id: driver.id, access_token })
      loadingMes()
    }
  };



  useEffect(() => {
    form.setFieldsValue({
      name: driver?.user?.name,
      email: driver?.user?.email,
      phone: driver?.user?.phone,
      dateOfBirth: user?.dateOfBirth ? dayjs(driver?.user?.dateOfBirth) : '',
      gender: driver?.user?.gender,
      citizenId: driver?.citizenId,
      address: driver?.address,
      licenseType: driver?.licenseType,
    });
    setImageUrl(driver?.user?.avatar)
  }, [driver])


  const handleChange = (info) => {

    setIAvatarFile(info.file.originFileObj)
    getBase64(info.file.originFileObj, (url) => {
      setImageUrl(url);
    });
  };


  const mutationDelete = useMutation(
    {
      mutationFn: (data) => {
        const { id, access_token } = data
        return deleteDriver(id, access_token)
      },
      onSuccess: (data) => {
        successMes(data.message)
        refetch()
      },
      onError: (data) => {
        errorMes(data?.response?.data?.message)
      }
    }
  )



  const handleDeleteDriver = () => {
    mutationDelete.mutate({ id: driver.user.id, access_token })
  }

  const me = <h1>Lưu ý</h1>
  return (
    <div style={{ width: '100%', height: '95%', backgroundColor: '#e0f2f5', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1>Thông tin tài xế</h1>

          {
            imageUrl ? <img
              src={imageUrl}
              style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%', marginTop: '20px', marginBottom: '20px' }} /> :
              <div
              >
                <UserOutlined style={{ display: 'flex', justifyContent: 'center', backgroundColor: 'lightblue', fontSize: '100px', width: '150px', height: '150px', borderRadius: '50%', marginTop: '20px', marginBottom: '20px' }} />
              </div>
          }

          <Upload
            showUploadList={false}
            maxCount={1}
            onChange={handleChange}
          >
            <Button icon={<UploadOutlined />}>Tải ảnh</Button>
          </Upload>
        </div>

        <Form.Item
          style={{ marginTop: '40px' }}
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: "Email không được bỏ trống !",
            },
            {
              type: "email",
              message: "Email không đúng định dạng !",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="name"
          label="Họ và tên"
          rules={[
            {
              required: true,
              message: "Tên không được bỏ trống !",
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            {
              required: true,
              message: "Số điện thoại không được bỏ trống !",
            },
            {
              min: 10,
              max: 11,
              message: "Số điện thoại không đúng định dạng !",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[
            {
              required: true,
              message: "Địa chỉ không được bỏ trống !",
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="dateOfBirth"
          label="Ngày sinh"
          rules={[
            {
              required: true,
              message: "Ngày sinh không được bỏ trống !",
            }
          ]}
        >
          <DatePicker format='DD/MM/YYYY' style={{ width: '200px' }} />
        </Form.Item>
        <Form.Item
          name="citizenId"
          label="Số căn cước"
          rules={[
            {
              required: true,
              message: "Không được bỏ trống !",
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="licenseType"
          label="Loại bằng lái"
          rules={[
            {
              required: true,
              message: "Không được bỏ trống !",
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="gender"
          label="Giới tính"
          rules={[
            {
              required: true,
              message: "Không được bỏ trống !",
            }
          ]}
        >
          <Select style={{ width: '200px' }}>
            <Option value="male">Nam</Option>
            <Option value="female">Nữ</Option>
            <Option value="other">Khác</Option>
          </Select>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 7, span: 18 }} style={{ textAlign: 'center', marginTop: '40px' }}>
          <Button type="primary" htmlType="submit" >
            Chỉnh sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa tài xế?"
            description={<div style={{ color: 'red', width: '300px' }}>! Lưu ý: Các chuyến sắp tới của tài xế này sẽ được cập nhật. Bạn cần kiểm tra lại.</div>}
            onConfirm={handleDeleteDriver}
            // onCancel={cancel}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button type="primary" danger style={{ padding: '0px 35px', marginLeft: '30px' }} >
              Xóa
            </Button>
          </Popconfirm>

        </Form.Item>
      </Form>
    </div>
  )
}

export default DriverInformation