import React, { useEffect } from 'react'
import { Form, Input, Button, Card } from "antd";
import { LoginOutlined, HomeOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { useNavigate } from 'react-router-dom';
import { error, success, loading, destroy } from '../../components/Message';
import { useMutation } from '@tanstack/react-query';
import { signupUser } from '../../services/UserService';



const { Title } = Typography;

const SignUpPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate()

    const mutation = useMutation(
        { mutationFn: (data) => signupUser(data) }
    )

    const { data, isLoading, isSuccess, isError } = mutation

    useEffect(() => {
        if (isSuccess && data?.status === "OK") {
            success();
            console.log('success', mutation);
            navigate('/sign-in')
        } else if (isError || data?.status === "ERR") {
            console.log('err', data);
            console.log('e', mutation);
            error(data?.message);
        }
    }, [isSuccess, isError])

    const onFinish = (values) => {
        loading()
        mutation.mutate({ email: values.email, phone: values.phone, password: values.password, confirmPassword: values.confirmPassword });
    }
    return (
        <div className='form_signin'>
            <Card >
                <Form
                    name="signin"
                    onFinish={onFinish}
                >
                    <Title level={2} className="text-center">
                        Đăng ký
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
                    <Form.Item
                        name="password"
                        hasFeedback
                        label="Mật khẩu"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        rules={[
                            {
                                required: true,
                                message: "Mật khẩu không được bỏ trống !",
                            },
                            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự !" },
                        ]}
                    >
                        <Input.Password placeholder="Mật khẩu" size="large" defaultValue="" />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        hasFeedback
                        label="Nhập lại mật khẩu"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
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
                        <Input.Password placeholder="Nhập lại mật khẩu" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <a onClick={() => navigate('/sign-in')}>
                                Đăng nhập
                            </a>

                            <a onClick={() => navigate('/')}>
                                Về trang chủ
                                <HomeOutlined style={{ marginLeft: '10px' }} />
                            </a>
                        </div>
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        shape="round"
                        icon={<LoginOutlined />}
                        size="large"
                        style={{ marginTop: '10px' }}
                    >
                        Đăng ký
                    </Button>
                </Form>
            </Card>
        </div>
    )
}

export default SignUpPage