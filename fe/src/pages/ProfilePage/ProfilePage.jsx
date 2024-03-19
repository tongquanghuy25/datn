import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation } from '@tanstack/react-query';
import { updateUser } from '../../services/UserService';
import { Button, Card, Form, Input, Select } from 'antd';
import Title from 'antd/es/typography/Title';


const ProfilePage = () => {
    const user = useSelector((state) => state.user)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [avatar, setAvatar] = useState('')
    const [form] = Form.useForm();

    const mutation = useMutation({
        mutationFn: (data) => {
            const { id, access_token, ...rests } = data
            updateUser(id, rests, access_token)
        }
    })

    const dispatch = useDispatch()
    const { data, isLoading, isSuccess, isError } = mutation
    console.log('huy', user);
    console.log('huyhhhh', email);


    useEffect(() => {
        setEmail(user?.email)

        setName(user?.name)
        setPhone(user?.phone)
        setAddress(user?.address)
        setAvatar(user?.avatar)
        form.setFieldsValue({
            email: user?.email,
            name: user?.name,
            address: user?.address,
            phone: user?.phone,
        });
    }, [user])

    const huy = "huuuu"

    return (
        <div>
            <Card>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    form={form}
                    onFinish={() => { }}
                    style={{ maxWidth: 600 }}
                >
                    <Title level={2} className="text-center">
                        Cập nhật thông tin
                    </Title>
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
                        name="address"
                        label="Địa chỉ"
                    >
                        <Input placeholder="Địa chỉ" />
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
                    {/* <Form.Item
                        name="email"
                        label="Email"
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
                        <Input placeholder="Email" />
                    </Form.Item>
                    <Form.Item label="Select">
                        <Select>
                            <Select.Option value="demo">Demo</Select.Option>
                        </Select>
                    </Form.Item> */}
                    <Form.Item label="Button">
                        <Button>Button</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default ProfilePage