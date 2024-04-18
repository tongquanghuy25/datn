import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Popconfirm, Upload } from 'antd'
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { updateUser } from '../../../services/UserService';
import { error, loading, success } from '../../Message';
import { deleteDriver } from '../../../services/DriverService';


const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

const DriverInformation = (props) => {
  const { driver, access_token, refetch } = props
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState();
  const [avatarFile, setIAvatarFile] = useState();

  const mutation = useMutation(
    {
      mutationFn: (data) => {
        const { id, access_token, ...rest } = data
        return updateUser(id, rest, access_token)
      }
    }
  )

  const { data, isSuccess, isError } = mutation


  const onFinish = (values) => {
    let data = {}
    if (values.email !== driver?.userId?.email) data = { ...data, email: values.email }
    if (values.name !== driver?.userId?.name) data = { ...data, name: values.name }
    if (values.phone !== driver?.userId?.phone) data = { ...data, phone: values.phone }
    if (avatarFile) data = { ...data, avatar: avatarFile }

    if (Object.keys(data).length > 0) {
      console.log('aa', data);
      mutation.mutate({ ...data, id: driver.userId._id, access_token })
      loading()
    }
  };

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      success(data?.message)
    } else if (isError || data?.status === "ERR") {
      error(data?.message)
    }
    refetch()
  }, [isSuccess, isError])

  useEffect(() => {
    form.setFieldsValue({
      name: driver?.userId?.name,
      email: driver?.userId?.email,
      phone: driver?.userId?.phone
    });
    setImageUrl(driver?.userId?.avatar)
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
      }
    }
  )

  const { data: dataDelete, isSuccess: isSuccessDelete, isError: isErrorDelete } = mutationDelete

  useEffect(() => {
    if (isSuccessDelete && dataDelete?.status === "OK") {
      success(dataDelete?.message)
    } else if (isErrorDelete || dataDelete?.status === "ERR") {
      error(dataDelete?.message)
    }
    refetch()
  }, [isSuccessDelete, isErrorDelete])

  const handleDeleteDriver = () => {
    mutationDelete.mutate({ id: driver.userId._id, access_token })
  }

  const confirm = (e) => {
    handleDeleteDriver()
  };
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

        <Form.Item wrapperCol={{ offset: 7, span: 18 }} style={{ textAlign: 'center', marginTop: '40px' }}>
          <Button type="primary" htmlType="submit" >
            Chỉnh sửa
          </Button>
          <Popconfirm
            title="Xóa tài xế"
            description="Bạn có chắc chắn muốn xóa tài xế"
            onConfirm={confirm}
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