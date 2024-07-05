import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useHandleLogout } from '../../utils/Action/HandleLogOut';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;


const TicketAgentPage = () => {
    const location = useLocation();
    const [selectedTab, setSelectedTab] = useState('ticketSales');
    const navigate = useNavigate();

    useEffect(() => {
        const currentPath = location.pathname.split('/')[2];
        setSelectedTab(currentPath);
    }, [location]);


    const handleTabChange = ({ key }) => {
        navigate(`/agent/${key}`)
        setSelectedTab(key);
    };



    const handleLogOut = useHandleLogout()
    return (
        <Layout >
            <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ color: 'white', margin: 0 }}>Trang đại lý</h1>
                </div>
                <div style={{ flex: 1, marginLeft: '80px' }}>
                    <Menu theme="dark" mode="horizontal" selectedKeys={[selectedTab]} onClick={handleTabChange}>
                        <Menu.Item key="sale-tickets">Bán vé</Menu.Item>
                        <Menu.Item key="tickets-saled">Vé đã bán</Menu.Item>
                        <Menu.Item key="financial">Quản lý tài chính</Menu.Item>
                    </Menu>
                </div>
                <div>
                    <Button type="primary" icon={<LogoutOutlined />} onClick={() => { handleLogOut() }}>
                        Đăng xuất
                    </Button>
                </div>
            </Header>
            <Content style={{ backgroundColor: 'white' }} >
                <Outlet />
            </Content>
        </Layout>
    )
}

export default TicketAgentPage