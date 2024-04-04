import './style.css'
import { Menu, Popover, Space, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import logo from '../../acess/logo.png'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
    UserOutlined,
    CaretDownOutlined,
    AppstoreOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons';
import AdminComponent from '../../components/Admin/AdminComponent'
import AdminCarComponent from '../../components/Admin/AdminCarComponent'
import AdminUserComponent from '../../components/Admin/AdminUserComponent'
import AdminCarOwnerComponent from '../../components/Admin/AdminCarOwnerComponent'
import AdminTicketComponent from '../../components/Admin/AdminTicketComponent'
import AdminDriverComponent from '../../components/Admin/AdminDriverComponent'

const AdminPage = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const [userName, setUserName] = useState('')
    const [userAvatar, setUserAvatar] = useState('')

    const [selectedKeys, setSelectedKeys] = useState("admin");

    useEffect(() => {
        setUserName(user?.name)
        setUserAvatar(user?.avatar)
    }, [user?.name, user?.avatar])
    console.log('user', user);


    switch (selectedKeys) {
        case 'admin':
            var content = <AdminComponent></AdminComponent>
            break;
        case 'car':
            var content = <AdminCarComponent></AdminCarComponent>
            break;
        case 'user':
            var content = <AdminUserComponent></AdminUserComponent>
            break;
        case 'carowner':
            var content = <AdminCarOwnerComponent></AdminCarOwnerComponent>
            break;
        case 'ticket':
            var content = <AdminTicketComponent></AdminTicketComponent>
            break;
        case 'driver':
            var content = <AdminDriverComponent></AdminDriverComponent>
            break;
    }
    return (
        <div>
            <div
                className='Admin-header'>
                <div onClick={() => navigate('/')}>
                    {/* <a href="https://vexere.com"> */}
                    <img className='logo-header' src={logo} alt="logo" />
                    {/* </a> */}
                </div>
                <Typography.Title>Admin</Typography.Title>
                <Space>
                    {userAvatar ? (
                        <img src={userAvatar} alt="avatar" style={{
                            height: '50px',
                            width: '50px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginRight: '10px',
                            border: '1px solid yellow'
                        }} />
                    ) : (
                        <UserOutlined style={{ fontSize: '30px', color: 'white', marginLeft: '10px' }} />
                    )}
                    {user?.access_token ? (
                        <div style={{ color: 'black', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                            {userName?.length ? userName : user?.email}
                        </div>

                    ) :
                        (<div onClick={() => { navigate('/sign-in') }} className='text' style={{ cursor: 'pointer' }}>
                            Đăng nhập/Đăng ký
                            <div>
                                Tài khoản
                                <CaretDownOutlined />
                            </div>
                        </div>)
                    }
                </Space>
            </div>
            <div style={{ display: 'flex' }}>
                <div
                    className='Admin-menu'>
                    <Menu
                        className="SideMenuVertical"
                        mode="vertical"
                        onClick={(item) => {
                            setSelectedKeys(item.key)
                        }}
                        selectedKeys={[selectedKeys]}
                        items={[
                            {
                                label: "Trang chủ",
                                icon: <AppstoreOutlined />,
                                key: "admin",
                            },
                            {
                                label: "Quản lý người dùng",
                                icon: <ShopOutlined />,
                                key: "user",
                            },
                            {
                                label: "Quản lý tài xế",
                                key: "driver",
                                icon: <ShoppingCartOutlined />,
                            },
                            {
                                label: "Quản lý nhà xe",
                                key: "carowner",
                                icon: <UserOutlined />,
                            },
                            {
                                label: "Quản lý xe",
                                key: "car",
                                icon: <UserOutlined />,
                            },
                            {
                                label: "Quản lý vé xe",
                                key: "ticket",
                                icon: <UserOutlined />,
                            },

                        ]}
                    ></Menu>
                </div>
                <div style={{ marginLeft: '20px', marginTop: '30px', flex: 1 }} className='Admin-content'>
                    {content}
                </div>
            </div>

        </div>
    )
}

export default AdminPage