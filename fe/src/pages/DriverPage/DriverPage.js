import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import {

    UserOutlined,
    DesktopOutlined,
    PieChartOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { Avatar, Button, Layout, Menu, theme } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import RunningTripComponent from '../../components/DriverComponent/RunningTripComponent/RunningTripComponent';
import ListMyTripComponent from '../../components/DriverComponent/ListMyTripComponent/ListMyTripComponent';
import StatisticComponent from '../../components/DriverComponent/StatisticComponent/StatisticComponent';
import { useHandleLogout } from '../../utils/Action/HandleLogOut';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
const { Header, Sider, Content } = Layout;


function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}
const items = [
    getItem('Chuyến xe đang chạy', 'running-trip', <PieChartOutlined />),
    getItem('Chuyến xe của tôi', 'my-trip', <DesktopOutlined />),
    getItem('Thống kê', 'statistical', <DesktopOutlined />),
    getItem('Thông tin tài khoản', 'profile', <DesktopOutlined />),
    getItem('Đổi mật khẩu', 'change-password', <DesktopOutlined />),
];


const DriverPage = () => {
    const user = useSelector((state) => state.user);
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState('1');

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    useEffect(() => {
        const currentPath = location.pathname.split('/')[2];
        setSelectedKeys(currentPath);
    }, [location]);

    const handleSliderChange = (value) => {
        navigate(`/driver/${value?.key}`)
    };


    const handleLogOut = useHandleLogout()
    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider
                trigger={null}
            >
                <div className="user-info" style={{ padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
                    <Avatar size={64} src={user?.avatar} icon={<UserOutlined />} />
                    <div style={{ marginTop: '10px', color: 'white', fontSize: '20px' }}>Xin chào tài xế</div>
                    <div style={{ marginTop: '5px', color: 'white', fontSize: '16px' }}>{user?.name}</div>
                </div>
                <Menu
                    theme="dark"
                    // mode="inline"
                    items={items}
                    onSelect={handleSliderChange}
                    selectedKeys={selectedKeys}

                />
                <div style={{ display: 'flex', height: '280px', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <Button type="primary" icon={<LogoutOutlined />} danger onClick={() => { handleLogOut() }}>
                        Đăng xuất
                    </Button>
                </div>
            </Sider>
            <Layout>

                <Content
                    style={{
                        // margin: '24px 16px',
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout >

    );
}

export default DriverPage
