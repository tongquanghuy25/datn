import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useHandleLogout } from '../../utils/Action/HandleLogOut';
import TicketSales from '../../components/AgentComponent/TicketSales/TicketSales';

const { Header, Content } = Layout;


const TicketAgentPage = () => {
    const [selectedTab, setSelectedTab] = useState('ticketSales');


    const handleTabChange = ({ key }) => {
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
                        <Menu.Item key="ticketSales">Bán vé</Menu.Item>
                        <Menu.Item key="trip">Vé đã bán</Menu.Item>
                        <Menu.Item key="route">Quản lý tài chính</Menu.Item>
                    </Menu>
                </div>
                <div>
                    <Button type="primary" icon={<LogoutOutlined />} onClick={() => { handleLogOut() }}>
                        Đăng xuất
                    </Button>
                </div>
            </Header>
            <Content >
                {/*  <LoadingComponent></LoadingComponent> */}
                {selectedTab === 'ticketSales' && <TicketSales></TicketSales>}
                {selectedTab === 'driver' && 'dd'}
                {selectedTab === 'trip' && 'dđss'}
                {selectedTab === 'route' && 'b'}
                {selectedTab === 'bus' && 'a'}
            </Content>
        </Layout>
    )
}

export default TicketAgentPage