import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Card, Modal } from "antd";
import { LoginOutlined, HomeOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { useNavigate } from 'react-router-dom';
import { error, success, loading, destroy } from '../../components/Message';
import { useMutation } from '@tanstack/react-query';



const { Title } = Typography;

const ForgotPasswordPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate()

    // const mutation = useMutation(
    //     { mutationFn: (data) => signupUser(data) }
    // )

    // const { data, isLoading, isSuccess, isError } = mutation

    // useEffect(() => {
    //     if (isSuccess && data?.status === "OK") {
    //         success();
    //         console.log('success', mutation);
    //         navigate('/sign-in')
    //     } else if (isError || data?.status === "ERR") {
    //         console.log('err', data);
    //         console.log('e', mutation);
    //         error(data?.message);
    //     }
    // }, [isSuccess, isError])

    const onFinish = (values) => {
        // loading()
        showModal()
        // mutation.mutate({ email: values.email, phone: values.phone, password: values.password, confirmPassword: values.confirmPassword });
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
        navigate('/sign-in')
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <div className='form_signin'>
            <Card >
                <Form
                    name="forgotpassword"
                    onFinish={onFinish}
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
                        style={{ marginTop: '10px' }}
                    >
                        Lấy lại mật khẩu
                    </Button>
                </Form>
            </Card>
            <Modal title="Basic Modal"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </div>
    )
}

export default ForgotPasswordPage