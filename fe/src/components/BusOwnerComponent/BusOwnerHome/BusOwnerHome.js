import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Layout, Menu, theme } from 'antd';
import GoodsManagerment from './BusOwnerHomeTabs/GoodManagerment/GoodsManagerment';
import TicketManagerment from './BusOwnerHomeTabs/TicketManagerment/TicketManagerment';
import TripManagerment from './BusOwnerHomeTabs/TripManagerment/TripManagerment';
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
    getItem('Thống kê', 'statistical', <DesktopOutlined />),
    getItem('Quản lý chuyến', 'trip', <DesktopOutlined />),
    getItem('Quản lý vé', 'ticket', <PieChartOutlined />),
    getItem('Quản lý hàng hóa', 'goods', <DesktopOutlined />),
    getItem('Quản lý tài chính', 'financial', <DesktopOutlined />),
    getItem('Thông tin tài khoản', 'account-information', <DesktopOutlined />),
    getItem('Đổi mật khẩu', 'change-assword', <DesktopOutlined />),
];


const BusOwnerHome = () => {
    const user = useSelector((state) => state.user);
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState('statistical');
    const [content, setContent] = useState();

    useEffect(() => {
        const currentPath = location.pathname.split('/')[3];
        setSelectedKeys(currentPath);
    }, [location]);


    const handleSliderChange = (value) => {
        navigate(`/bus-owner/home/${value?.key}`)
        setSelectedKeys(value?.key)
    };

    return (
        <Layout
            theme="light"
            style={{
                minHeight: 'calc(100vh - 65px)',
            }}
        >
            <Sider
                trigger={null}
            >

                <Menu
                    theme="light"
                    // mode="inline"
                    items={items}
                    onSelect={handleSliderChange}
                    selectedKeys={selectedKeys}
                    style={{ paddingTop: '50px', minHeight: 'calc(100vh - 65px)', }}

                />

            </Sider>
            <Layout>

                <Content
                    style={{
                        minHeight: 280,
                    }}
                >
                    <Outlet />
                </Content>

            </Layout>
        </Layout >

    )
}

export default BusOwnerHome