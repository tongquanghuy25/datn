import React, { useEffect, useState } from 'react';
import './style.css';
import { Form, Input, Button, Card, Modal } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { useNavigate } from 'react-router-dom';
import { getDetailsUser, loginUser } from '../../services/UserService';
import { errorMes, loadingMes, successMes } from '../../components/Message/Message';
import { useMutation } from '@tanstack/react-query';
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide';
import { getDetailBusOwnerByUserId } from '../../services/BusOwnerSevice';



const { Title } = Typography;

const SignInPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user)

  const mutation = useMutation(
    {
      mutationFn: (data) => loginUser(data),
      onSuccess: (data) => {
        successMes(data.message)
        localStorage.setItem('access_token', JSON.stringify(data?.access_token))
        localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token))
        if (data?.access_token) {
          const decoded = jwtDecode(data?.access_token)
          if (decoded?.id) {
            handleGetDetailsUser(decoded?.id, data?.access_token)
          }
          if (decoded?.role === 'admin') {
            navigate('/admin')
          } else if (decoded?.role === 'busowner') {
            handleGetDetailBusOwner(decoded?.id, data?.access_token)
            navigate('/bus-owner')
          } else navigate('/')
        }

      },
      onError: (data) => {
        errorMes(data?.response?.data?.message)
      }
    }
  )

  const handleGetDetailsUser = async (id, token) => {
    const storage = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storage)
    const res = await getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken }))
  }


  const handleGetDetailBusOwner = async (id, token) => {
    const res = await getDetailBusOwnerByUserId(id, token)
    localStorage.setItem('bus_owner_id', JSON.stringify(res?.data?._id))
    localStorage.setItem('bus_owner_name', JSON.stringify(res?.data?.name))
  }

  const onFinish = (values) => {
    loadingMes()
    mutation.mutate({ email: values.email, password: values.password });
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
          style={{ width: '400px' }}
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
                message: "Email không được bỏ trống.",
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
              <a onClick={() => navigate('/sign-up')}>
                Tạo tài khoản mới
              </a>

              <a onClick={() => navigate('/forgot-password')}>
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