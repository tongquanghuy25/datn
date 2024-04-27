import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation } from '@tanstack/react-query';
import { updateUser as updateUserApi } from '../../services/UserService';
import { Button, Card, Form, Input, Select, Upload } from 'antd';
import Title from 'antd/es/typography/Title';
import { errorMes, loadingMes, successMes } from '../../components/Message';
import { updateUser } from '../../redux/slides/userSlide';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

const ProfilePage = () => {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [isloading, setisLoading] = useState(false);
    const [avatar, setAvatar] = useState('')
    const [form] = Form.useForm();
    const [avatarFile, setAvatarFile] = useState('')


    const mutation = useMutation({
        mutationFn: (data) => {
            const { id, formData, access_token } = data
            return updateUserApi(id, formData, access_token)
        },
        onSuccess: (data) => {
            successMes("Cập nhật người dùng thành công !");
            dispatch(updateUser({ email: data?.data?.email, name: data?.data?.name, phone: data?.data?.phone, avatar: data?.data?.avatar }))

        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    })


    useEffect(() => {
        form.setFieldsValue({
            email: user?.email,
            name: user?.name,
            phone: user?.phone,
        });
        setAvatar(user?.avatar)
    }, [user])

    const onFinish = (values) => {
        loadingMes()
        const formData = new FormData();
        formData.append('email', values.email);
        formData.append('phone', values.phone);
        formData.append('name', values.name);
        formData.append('avatar', avatarFile);

        mutation.mutate({
            id: user?.id,
            formData,
            access_token: user?.access_token
        });
    }


    const handleChange = (info) => {
        setAvatarFile(info.file.originFileObj)
        getBase64(info.file.originFileObj, (url) => {
            setisLoading(false);
            setAvatar(url);
        });
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
        <>
            <HeaderComponent></HeaderComponent>
            <Form
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                form={form}
                onFinish={onFinish}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
            >
                <Title level={2} style={{ marginBottom: '20px' }} className="text-center">
                    Cập nhật thông tin
                </Title>
                <Form.Item>
                    <Upload
                        name="avatar"
                        maxCount={1}
                        listType="picture-circle"
                        className="avatar-uploader"
                        showUploadList={false}
                        onChange={handleChange}
                    >
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
                <div style={{ marginTop: '-20px' }}>Ảnh đại diện</div>

                <div style={{ width: '40%' }}>

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
                </div>
                <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                >
                    Cập nhật
                </Button>
            </Form>
        </>

    )
}

export default ProfilePage