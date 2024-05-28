import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Card, Modal } from "antd";
import { LoginOutlined, HomeOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { useNavigate } from 'react-router-dom';
import { error, success, loading, destroy, loadingMes, successMes, errorMes } from '../../components/Message/Message';
import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '../../services/UserService';



const { Title } = Typography;

const ForgotPasswordPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate()

    const mutation = useMutation(
        {
            mutationFn: (data) => {
                resetPassword(data)
            },
            onSuccess: (data) => {
                successMes(data?.message);
                navigate('/sign-in')
            },
            onError: (data) => {
                errorMes(data?.response?.data?.message)
            }
        }
    )


    const onFinish = (values) => {
        loadingMes()
        mutation.mutate({ email: values.email, phone: values.phone });
    }

    return (
        <div className='form_signin'>
            <Card >
                <Form
                    name="forgotpassword"
                    onFinish={onFinish}
                    style={{ width: '400px' }}
                >
                    <Title level={2} className="text-center">
                        Lấy lại mật khẩu
                    </Title>
                    <Form.Item
                        name="email"
                        hasFeedback
                        label="Email"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
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
                        <Input placeholder="Email" size="large" />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        hasFeedback
                        label="Số điện thoại"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
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
                        <Input placeholder="Số điện thoại" size="large" />
                    </Form.Item>


                    <Button
                        type="primary"
                        htmlType="submit"
                        shape="round"
                        icon={<LoginOutlined />}
                        size="large"
                        style={{ marginTop: '20px' }}
                    >
                        Lấy lại mật khẩu
                    </Button>
                </Form>
            </Card>

        </div>
    )
}

export default ForgotPasswordPage