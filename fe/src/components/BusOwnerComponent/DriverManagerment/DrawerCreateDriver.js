import React, { useEffect, useState } from 'react';
import { PlusOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, Upload, Image, Flex, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { driverRegister } from '../../../services/DriverService';
import { useSelector } from 'react-redux'


const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

const DrawerCreateDriver = (props) => {

    const { open, onClose, refetch } = props
    const user = useSelector((state) => state.user)
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState();
    const [avatarFile, setAvatarFile] = useState(null);
    const [messageApi] = message.useMessage();

    const mutation = useMutation(
        {
            mutationFn: (data) => {
                const { formData, access_token } = data
                return driverRegister(access_token, formData)
            },
            onSuccess: (data) => {
                message.destroy()
                message.success({
                    content: `${data?.message}`,
                    style: {
                        marginLeft: '700px'
                    },
                });
                refetch()
            },
            onError: (data) => {
                message.destroy()
                message.error({
                    content: data?.response?.data?.message ? data?.response?.data?.message : 'Thêm tài xế thất bại!',
                    style: {
                        marginLeft: '700px'
                    },
                });
            }
        }
    )


    const handleChange = (info) => {
        setAvatarFile(info.file)
        getBase64(info.file?.originFileObj, (url) => {
            setImageUrl(url);
        });
    };




    const onFinish = async (values) => {
        message.destroy()
        message.loading({
            content: 'loading',
            style: {
                marginLeft: '700px'
            },
            duration: 10,
        });
        const formData = new FormData();
        formData.append('email', values.email);
        formData.append('name', values.name);
        formData.append('phone', values.phone);
        formData.append('password', values.password);
        formData.append('confirmPassword', values.confirmPassword);
        formData.append('role', 'driver');
        formData.append('avatar', avatarFile?.originFileObj);
        formData.append('busOwnerId', user?.id);

        mutation.mutate({
            formData,
            access_token: user?.access_token
        });
    };

    const handleClose = () => {
        form.resetFields();
        setAvatarFile('')
        setImageUrl('')
        onClose()
    }

    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusOutlined />
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
            <Drawer
                title="Tạo tài khoản tài xế"
                width={720}
                onClose={handleClose}
                open={open}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}

            >

                <Form layout="vertical" form={form} onFinish={onFinish}>
                    <Form.Item
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
                        name="password"
                        label="Mật khẩu"
                        rules={[
                            {
                                required: true,
                                message: "Mật khẩu không được bỏ trống !",
                            },
                            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự !" },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label="Nhập lại mật khẩu"
                        rules={[
                            {
                                required: true,
                                message: 'Nhập lại mật khẩu không được bỏ trống !',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu nhập lại không đúng !'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="avatar"
                        label="Ảnh đại diện"
                    >
                        <Upload
                            style={{
                                width: '200px',
                                height: '200px',

                            }}
                            name="avatar"
                            listType="picture-circle"
                            className="avatar-uploader"
                            showUploadList={false}
                            onChange={handleChange}
                        >
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
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
                    <Form.Item style={{ marginTop: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button type="primary" htmlType="submit">
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>

            </Drawer>
        </>
    )
}

export default DrawerCreateDriver