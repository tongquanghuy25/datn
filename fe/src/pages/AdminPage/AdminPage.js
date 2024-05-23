import './style.css'
import { Layout, Menu, Button } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    UserOutlined,
    LogoutOutlined,
    AppstoreOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons';
import AdminComponent from '../../components/Admin/AdminHomeComponent'
import AdminBusComponent from '../../components/Admin/AdminBusComponent'
import AdminUserComponent from '../../components/Admin/AdminUserComponent'
import AdminBusOwnerComponent from '../../components/Admin/AdminBusOwnerComponent'
import AdminTicketComponent from '../../components/Admin/AdminTicketComponent'
import AdminDriverComponent from '../../components/Admin/AdminDriverComponent'
import AcceptBusOwner from '../../components/Admin/AcceptBusOwner'
import { useHandleLogout } from '../../utils/Action/HandleLogOut';
import AdminDiscountComponent from '../../components/Admin/AdminDiscountComponent';
import AdminHomeComponent from '../../components/Admin/AdminHomeComponent';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

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
        <div >
            <Header style={{ padding: '10px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div >
                    <h1 style={{ color: 'white', margin: 0 }}>Trang Admin</h1>
                </div>
                <div>
                    <Button type="primary" icon={<LogoutOutlined />} onClick={() => { handleLogOut() }}>
                        Đăng xuất
                    </Button>
                </div>
            </Header>
            <div style={{ display: 'flex' }}>
                <div
                    className='Admin-menu'>
                    <Menu
                        className="SideMenuVertical"
                        mode="vertical"
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
                            {
                                label: "Quản lý mã giảm giá",
                                key: "discount",
                                icon: <UserOutlined />,
                            },

                        ]}
                    ></Menu>
                </div>
                <div style={{ marginLeft: '20px', marginTop: '10px', flex: 1, height: 'calc(100vh - 150px)' }} className='Admin-content'>
                    <Outlet></Outlet>
                </div>
            </div>

        </div>
    )
}

export default AdminPage