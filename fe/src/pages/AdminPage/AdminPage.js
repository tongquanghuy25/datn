import './style.css'
import { Layout, Menu, Button, Row } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    UserOutlined,
    LogoutOutlined,
    AppstoreOutlined,
    ShopOutlined,
} from '@ant-design/icons';
import { useHandleLogout } from '../../utils/Action/HandleLogOut';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sider from 'antd/es/layout/Sider';

const { Header, Content } = Layout;
const AdminPage = () => {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const location = useLocation();
    const [userName, setUserName] = useState('')
    const [userAvatar, setUserAvatar] = useState('')
    const [selectedKeys, setSelectedKeys] = useState("home");


    useEffect(() => {
        const currentPath = location.pathname.split('/')[2];
        setSelectedKeys(currentPath);
    }, [location]);

    ///
    useEffect(() => {
        setUserName(user?.name)
        setUserAvatar(user?.avatar)
    }, [user?.name, user?.avatar])

    const handleLogOut = useHandleLogout()

    return (
        <div style={{ display: 'flex' }}>
            <Layout style={{ height: '100vh', }}>
                <Sider
                    style={{ display: 'flex' }}
                >
                    <Row justify={'center'}>
                        <h1 style={{ color: 'white' }}>Admin Panel</h1>
                    </Row>
                    <Menu
                        style={{ display: 'flex', flexDirection: 'column', height: '80vh' }}
                        mode="inline"
                        theme="dark"
                        onClick={(item) => {
                            navigate(`/admin/${item.key}`)
                            setSelectedKeys(item.key);
                        }}
                        selectedKeys={[selectedKeys]}
                        items={[
                            {
                                label: "Trang chủ",
                                icon: <AppstoreOutlined />,
                                key: "home",
                            },
                            {
                                label: "Quản lý người dùng",
                                icon: <ShopOutlined />,
                                key: "user",
                            },
                            {
                                label: "Quản lý nhà xe",
                                key: "partner",
                                icon: <UserOutlined />,
                            },
                            {
                                label: "Phê duyệt nhà xe",
                                key: "accept-partner",
                                icon: <UserOutlined />,
                            },
                            // {
                            //     label: "Quản lý tài xế",
                            //     key: "driver",
                            //     icon: <ShoppingCartOutlined />,
                            // },
                            // {
                            //     label: "Quản lý xe",
                            //     key: "bus",
                            //     icon: <UserOutlined />,
                            // },
                            // {
                            //     label: "Quản lý vé xe",
                            //     key: "ticket",
                            //     icon: <UserOutlined />,
                            // },
                            {
                                label: "Quản lý mã giảm giá",
                                key: "discount",
                                icon: <UserOutlined />,
                            },
                            {
                                label: "Quản lý khiếu nại",
                                key: "report",
                                icon: <UserOutlined />,
                            },
                            {
                                label: "Gửi mail thông báo",
                                key: "sent-mail",
                                icon: <UserOutlined />,
                            },
                            {
                                label: "Thông tin tài khoản",
                                key: "profile",
                                icon: <UserOutlined />,
                            },
                            {
                                label: "Đổi mật khẩu",
                                key: "change-password",
                                icon: <UserOutlined />,
                            },

                        ]}
                    >
                    </Menu>
                    <Row justify={'center'} >
                        <Button type="primary" icon={<LogoutOutlined />} onClick={() => { handleLogOut() }}>
                            Đăng xuất
                        </Button>
                    </Row>
                </Sider>

                <Content>
                    <div style={{ marginLeft: '20px', flex: 1, height: '100vh', overflowY: 'auto' }} className='Admin-content'>
                        <Outlet></Outlet>
                    </div>
                </Content>
            </Layout>




        </div>
    )
}

export default AdminPage