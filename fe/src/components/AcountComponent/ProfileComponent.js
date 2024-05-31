import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation } from '@tanstack/react-query';
import { updateUser as updateUserApi } from '../../services/UserService';
import { Button, Card, DatePicker, Form, Input, Row, Select, Upload } from 'antd';
import Title from 'antd/es/typography/Title';
import { errorMes, loadingMes, successMes } from '../Message/Message';
import { updateUser } from '../../redux/slides/userSlide';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getBase64 } from '../../utils';
import { Option } from 'antd/es/mentions';

const ProfileComponent = () => {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [isloading, setisLoading] = useState(false);
    const [avatar, setAvatar] = useState('')
    const [form] = Form.useForm();
    const [avatarFile, setAvatarFile] = useState('')

    useEffect(() => {
        form.setFieldsValue({
            email: user?.email,
            name: user?.name,
            phone: user?.phone,
            dateOfBirth: user?.dateOfBirth ? dayjs(user?.dateOfBirth) : '',
            gender: user?.gender
        });
        setAvatar(user?.avatar)
    }, [user])



    const mutation = useMutation({
        mutationFn: (data) => {
            const { id, formData, access_token } = data
            return updateUserApi(id, formData, access_token)
        },
        onSuccess: (data) => {
            successMes("Cập nhật người dùng thành công !");
            dispatch(updateUser({ email: data?.data?.email, name: data?.data?.name, phone: data?.data?.phone, avatar: data?.data?.avatar, dateOfBirth: data?.data?.dateOfBirth, gender: data?.data?.gender }))

        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    })

    const onFinish = (values) => {
        loadingMes()
        const formData = new FormData();
        formData.append('email', values.email);
        formData.append('phone', values.phone);
        formData.append('name', values.name);
        formData.append('dateOfBirth', values.dateOfBirth.format('YYYY-MM-DD'));
        formData.append('gender', values?.gender);
        formData.append('avatar', avatarFile);

        mutation.mutate({
            id: user?.id,
            formData,
            access_token: user?.access_token
        });
    }


    const handleChange = (info) => {
        setAvatarFile(info.file.originFileObj)
        getBase64(info.file.originFileObj, (url) => {
            setisLoading(false);
            setAvatar(url);
        });
    };

    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            {isloading ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );

    return (
        <>
            {/* <HeaderComponent></HeaderComponent> */}
            <Form
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                form={form}
                onFinish={onFinish}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
            >
                <Title level={2} style={{ marginBottom: '20px' }} className="text-center">
                    Cập nhật thông tin
                </Title>
                <Form.Item>
                    <Upload
                        name="avatar"
                        maxCount={1}
                        listType="picture-circle"
                        className="avatar-uploader"
                        showUploadList={false}
                        onChange={handleChange}
                    >
                        {avatar ? (
                            <img
                                src={avatar}
                                alt="avatar"
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                }}
                            />

                        ) : (
                            uploadButton
                        )}
                    </Upload>

                </Form.Item>
                <div style={{ marginTop: '-20px' }}>Ảnh đại diện</div>

                <div style={{ width: '40%' }}>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            {
                                required: true,
                                message: "Email không được bỏ trống.",
                            },
                            {
                                type: "email",
                                message: "Email không đúng định dạng",
                            },
                        ]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Họ và tên"
                    >
                        <Input placeholder="Họ và tên" />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[
                            {
                                required: true,
                                message: "Số điện thoại không được bỏ trống.",
                            }
                        ]}
                    >
                        <Input placeholder="Số điện thoại" />
                    </Form.Item>
                    <Row >
                        <Form.Item
                            name="dateOfBirth"
                            label="Ngày sinh"
                        >
                            <DatePicker format='DD/MM/YYYY' style={{ width: '200px' }} />
                        </Form.Item>
                        <Form.Item
                            name="gender"
                            label="Giới tính"
                        >
                            <Select style={{ width: '150px' }}>
                                <Option value="male">Nam</Option>
                                <Option value="female">Nữ</Option>
                                <Option value="other">Khác</Option>
                            </Select>
                        </Form.Item>
                    </Row>

                </div>
                <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                >
                    Cập nhật
                </Button>
            </Form>
        </>

    )
}

export default ProfileComponent