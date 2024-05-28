import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Card, Row, Col, Radio } from "antd";
import { LoginOutlined, HomeOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { useNavigate } from 'react-router-dom';
import { errorMes, successMes, loadingMes, destroyMes } from '../Message/Message';
import { useMutation } from '@tanstack/react-query';
import { agentRegister, busOwnerRegister } from '../../services/PartnerSevice';

const { Title } = Typography;

const PartnerRegistrationForm = (props) => {
    const { isBusOwner } = props
    const [form] = Form.useForm();
    const navigate = useNavigate()

    const mutation = useMutation(
        {
            mutationFn: (data) => {
                if (isBusOwner) return busOwnerRegister(data)
                else return agentRegister(data)
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
        let data = {
            email: values.email,
            phone: values.phone,
            password: values.password,
            confirmPassword: values.confirmPassword,
            address: values.address,
            companyType: values.companyType,
            companyDescription: values.companyDescription, citizenId: values.citizenId,
            managerName: values.managerName,
            citizenId: values.citizenId,
            managerPhone: values.managerPhone,
            managerEmail: values.managerEmail,
        }
        if (isBusOwner) data.busOwnerName = values.partnerName
        else data.agentName = values.partnerName
        mutation.mutate(data);
    }

    const formItemLayout = {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
        style: { marginBottom: '8px' }
    };
    return (
        <div>
            <Form
                name="signin"
                onFinish={onFinish}
                style={{ width: '1000px' }}

            >
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                    Đăng ký trở thành nhà xe
                </div>
                <Row gutter={[48]}>
                    <Col span={8}>
                        <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '10px' }}>Thông tin tài khoản nhà xe</div>

                        <Form.Item
                            name="email"
                            hasFeedback
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
                            {...formItemLayout}
                        >
                            <Input placeholder="Email" size="large" />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            hasFeedback
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
                            {...formItemLayout}
                        >
                            <Input placeholder="Số điện thoại" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            hasFeedback
                            label="Mật khẩu"
                            rules={[
                                {
                                    required: true,
                                    message: "Mật khẩu không được bỏ trống !",
                                },
                                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự !" },
                            ]}
                            {...formItemLayout}
                        >
                            <Input.Password placeholder="Mật khẩu" size="large" defaultValue="" />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            hasFeedback
                            label="Nhập lại mật khẩu"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nhập lại mật khẩu không bỏ trống !',
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
                            {...formItemLayout}
                        >
                            <Input.Password placeholder="Nhập lại mật khẩu" size="large" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '10px' }}>Thông tin nhà xe</div>

                        <Form.Item
                            name="partnerName"
                            hasFeedback
                            label={isBusOwner ? 'Tên nhà xe' : 'Tên đại lý'}
                            rules={[
                                {
                                    required: true,
                                    message: "Tên nhà xe không được bỏ trống !",
                                }
                            ]}
                            {...formItemLayout}
                        >
                            <Input placeholder="Tên nhà xe" size="large" />
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
                            {...formItemLayout}
                        >
                            <Input placeholder="Địa chỉ" size="large" />
                        </Form.Item>
                        <Form.Item
                            name="companyType"
                            label="Loại hình doanh nghiệp"
                            rules={[{ required: true, message: 'Vui lòng nhập loại hình doanh nghiệp!' }]}
                            {...formItemLayout}
                        >
                            <Input placeholder="Địa chỉ" size="large" />
                        </Form.Item>
                        <Form.Item
                            name="companyDescription"
                            label="Mô tả"
                            {...formItemLayout}
                        >
                            <Input.TextArea />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '10px' }}>Thông tin người quản lý</div>
                        <Form.Item
                            name="managerName"
                            hasFeedback
                            label="Tên quản lý"
                            rules={[
                                {
                                    required: true,
                                    message: "Tên quản lý không được bỏ trống !",
                                }
                            ]}
                            {...formItemLayout}
                        >
                            <Input placeholder="Tên quản lý" size="large" />
                        </Form.Item>
                        <Form.Item
                            name="citizenId"
                            hasFeedback
                            label="Số căn cước"
                            rules={[
                                {
                                    required: true,
                                    message: "Căn cước công dân không được bỏ trống !",
                                }
                            ]}
                            {...formItemLayout}
                        >
                            <Input placeholder="Nhập căn cước công dân" size="large" defaultValue="" />
                        </Form.Item>
                        <Form.Item
                            label="Số điện thoại người quản lý"
                            name="managerPhone"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số điện thoại quản lý!'
                                },
                                {
                                    min: 10,
                                    max: 11,
                                    message: "Số điện thoại không đúng định dạng !",
                                },]}
                            {...formItemLayout}
                        >
                            <Input placeholder="Số điện thoại quản lý" size="large" />
                        </Form.Item>
                        <Form.Item
                            label="Email người quản lý"
                            name="managerEmail"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email quản lý!' },
                                { type: 'email', message: 'Vui lòng nhập email hợp lệ!' }
                            ]}
                            {...formItemLayout}
                        >
                            <Input placeholder="Email người quản lý" size="large" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
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
        </div>
    )
}

export default PartnerRegistrationForm