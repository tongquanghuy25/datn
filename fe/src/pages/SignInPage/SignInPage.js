import React, { useState } from 'react';
import './style.css';
import { Form, Input, Button, Card } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { useNavigate } from 'react-router-dom';


const { Title } = Typography;

const SignInPage = () => {
  const [form] = Form.useForm();

  const navigate = useNavigate()

  const onFinish = (values) => {
    console.log('huy', values);
  }

  return (

    <div className='form_signin'>
      <Card >
        <Form
          name="signin"
          form={form}
          initialValues={{
            remember: false,
            email: "",
            password: ""
          }}
          onFinish={onFinish}
        >
          <Title level={2} className="text-center">
            Đăng nhập
          </Title>
          {/* <SocialNetworks /> */}

          <Form.Item
            name="email"
            hasFeedback
            label="Email"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: "Mật khẩu không được bỏ trống.",
              },
              {
                type: "email",
                message: "Email không đúng định dạng",
              },
            ]}
          >
            <Input placeholder="Email" size="large" />
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
                message: "Mật khẩu không được bỏ trống.",
              },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự." },
            ]}
          >
            <Input.Password placeholder="Mật khẩu" size="large" defaultValue="" />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <a onClick={() => navigate('/sign-up')}>
                Tạo tài khoản mới
              </a>

              <a>
                Quên mật khẩu ?
              </a>
            </div>
          </Form.Item>

          <Button
            // loading={auth.loading}
            type="primary"
            htmlType="submit"
            shape="round"
            icon={<LoginOutlined />}
            size="large"
          >
            Đăng nhập
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default SignInPage