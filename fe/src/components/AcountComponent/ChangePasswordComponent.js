import { useMutation } from '@tanstack/react-query'
import { Button, Form, Input, Row } from 'antd'
import Title from 'antd/es/typography/Title'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { errorMes, loadingMes, successMes } from '../Message/Message'
import { changePassword } from '../../services/UserService'

const ChangePasswordComponent = () => {
    const user = useSelector((state) => state.user)
    const [form] = Form.useForm();

    const mutation = useMutation({
        mutationFn: (data) => {
            const { id, access_token, ...rest } = data
            return changePassword(id, access_token, rest)
        },
        onSuccess: () => {
            successMes("Đổi mật khẩu thành công !");
            form.resetFields()
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    })

    const onFinish = (values) => {
        loadingMes()

        mutation.mutate({
            id: user?.id,
            access_token: user?.access_token,
            password: values.password,
            newPassword: values.newPassword,
            confirmNewPassword: values.confirmNewPassword
        });
    }

    return (
        <Row justify={'center'} style={{ marginTop: '100px' }}>
            <Form
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                form={form}
                onFinish={onFinish}
                style={{ width: '400px', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', backgroundColor: '#f0f2f5' }}
            >
                <Title level={2} style={{ marginBottom: '40px' }} className="text-center">
                    Đổi mật khẩu
                </Title>

                <div >

                    <Form.Item
                        name="password"
                        label="Mật khẩu cũ"
                        rules={[
                            {
                                required: true,
                                message: "Mật khẩu không được bỏ trống.",
                            },
                            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự !" },
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu cũ" />
                    </Form.Item>
                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[
                            {
                                required: true,
                                message: "Mật khẩu mới không được bỏ trống.",
                            },
                            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự !" },
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu mới" />
                    </Form.Item> <Form.Item
                        name="confirmNewPassword"
                        label="Nhập lại mật khẩu mới"
                        rules={[
                            {
                                required: true,
                                message: "Mật khẩu mới không được bỏ trống.",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu nhập lại không đúng !'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Nhập lại mật khẩu mới" />
                    </Form.Item>
                </div>
                <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    style={{ marginTop: '30px' }}
                >
                    Xác nhận đổi
                </Button>
            </Form>
        </Row>
    )
}

export default ChangePasswordComponent