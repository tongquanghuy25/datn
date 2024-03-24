import React, { useState } from 'react';
import { Form, Input, Button, Upload, DatePicker, Select, Avatar } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';

const { Option } = Select;

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

const CarOwnerRegistration = () => {
    const [form] = Form.useForm();
    const [avatar, setAvatar] = useState('')
    const [isloading, setisLoading] = useState(false);


    const onFinish = (values) => {
        console.log('Received values:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setisLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (url) => {
                setisLoading(false);
                setAvatar(url);
            });
        }
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
        <div style={{ flexDirection: 'column', width: '100%', height: '100vh', display: 'flex', alignItems: 'center' }}>
            <HeaderComponent></HeaderComponent>
            <Form
                form={form}
                name="register"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ width: '600px' }}
            >

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <h1>Đăng ký trở thành tài xế</h1>
                </div>
                <Form.Item
                    name="avatar"
                    label="Ảnh đại diện"
                // valuePropName="fileList"
                // getValueFromEvent={() => []}
                >
                    <Upload
                        name="avatar"
                        listType="picture-circle"
                        className="avatar-uploader"
                        showUploadList={false}
                        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                        onChange={handleChange}>
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

                <Form.Item
                    name="name"
                    label="Họ và tên"
                    rules={[{
                        required: true,
                        message: 'Không được bỏ trống'
                    }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        {
                            type: 'email',
                            message: 'Email không đúng định dạng',
                        },
                        {
                            required: true,
                            message: 'Không được bỏ trống'
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="address"
                    label="Địa chỉ"
                    rules={[{
                        required: true,
                        message: 'Không được bỏ trống'
                    }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="identity"
                    label="Căn Cước Công Dân"
                    rules={[{
                        required: true,
                        message: 'Không được bỏ trống'
                    }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="gender"
                    label="Giới tính"
                    rules={[{
                        required: true,
                        message: 'Không được bỏ trống'
                    }]}
                >
                    <Select>
                        <Option value="male">Nam</Option>
                        <Option value="female">Nữ</Option>
                        <Option value="other">Khác</Option>
                    </Select>
                </Form.Item>


                <Form.Item
                    name="birthday"
                    label="Ngày sinh"
                    rules={[{ required: true, message: 'Please select your birthday!' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Đăng ký
                    </Button>
                </Form.Item>

            </Form>
        </div>
    )
}

export default CarOwnerRegistration