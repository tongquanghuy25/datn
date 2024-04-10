import './style.css'
import { Menu, Space, Typography } from 'antd'
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
import AdminBusComponent from '../../components/Admin/AdminBusComponent'
import AdminUserComponent from '../../components/Admin/AdminUserComponent'
import AdminBusOwnerComponent from '../../components/Admin/AdminBusOwnerComponent'
import AdminTicketComponent from '../../components/Admin/AdminTicketComponent'
import AdminDriverComponent from '../../components/Admin/AdminDriverComponent'
import AcceptBusOwner from '../../components/Admin/AcceptBusOwner'

const AdminPage = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const [userName, setUserName] = useState('')
    const [userAvatar, setUserAvatar] = useState('')
    const [selectedKeys, setSelectedKeys] = useState("admin");

    ///


    // const mutation = useMutation(
    //     { mutationFn: (data) => getAllUser(data) }
    // )
    // useEffect(() => {
    //     mutation.mutate(user?.access_token);
    // }, [])
    // const getAllUsers = 




    // useEffect(()=>{
    //     setUsers(data?.data)
    //     log
    // },[data])

    ///
    useEffect(() => {
        setUserName(user?.name)
        setUserAvatar(user?.avatar)
    }, [user?.name, user?.avatar])

    var content
    switch (selectedKeys) {
        case 'admin':
            content = <AdminComponent></AdminComponent>
            break;
        case 'bus':
            content = <AdminBusComponent></AdminBusComponent>
            break;
        case 'user':
            content = <AdminUserComponent></AdminUserComponent>
            break;
        case 'busowner':
            content = <AdminBusOwnerComponent></AdminBusOwnerComponent>
            break;
        case 'acceptbusowner':
            content = <AcceptBusOwner></AcceptBusOwner>
            break;
        case 'ticket':
            content = <AdminTicketComponent></AdminTicketComponent>
            break;
        case 'driver':
            content = <AdminDriverComponent></AdminDriverComponent>
            break;
        default:
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
                                key: "busowner",
                                icon: <UserOutlined />,
                            },
                            {
                                label: "Phê duyệt nhà xe",
                                key: "acceptbusowner",
                                icon: <UserOutlined />,
                            },
                            {
                                label: "Quản lý xe",
                                key: "bus",
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