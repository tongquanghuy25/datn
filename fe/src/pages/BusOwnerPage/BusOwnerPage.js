import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import DriverManagement from '../../components/BusOwnerComponent/DriverManagerment/DriverManagement';
import LoadingComponent from '../../components/Loading/LoadingComponent';
import BusManagerment from '../../components/BusOwnerComponent/BusManagerment/BusManagerment';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import RouteManagerment from '../../components/BusOwnerComponent/RouteManagerment/RouteManagerment';
import { useHandleLogout } from '../../utils/Action/HandleLogOut';
import BusOwnerHome from '../../components/BusOwnerComponent/BusOwnerHome/BusOwnerHome';
import ScheduleManagerment from '../../components/BusOwnerComponent/ScheduleManagerment/ScheduleManagerment';


const { Header, Content } = Layout;
const BusOwnerPage = () => {
    const location = useLocation();
    const [selectedTab, setSelectedTab] = useState('home');
    const navigate = useNavigate();

    useEffect(() => {
        const currentPath = location.pathname.split('/')[2];
        setSelectedTab(currentPath);
    }, [location]);


    const handleTabChange = ({ key }) => {
        navigate(`/bus-owner/${key}${key === 'home' ? '/statistical' : ''}`)
        setSelectedTab(key);
    };


    const handleLogOut = useHandleLogout()

    return (
        <Layout style={{ backgroundColor: '#fff' }}>
            <Header style={{ height: '8vh', display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>
                <div>
                    <div style={{ fontSize: 36, fontWeight: 'bold', color: 'white', margin: 0 }}>Trang nhà xe</div>
                </div>
                <div style={{ flex: 1, marginLeft: '80px' }}>
                    <Menu style={{ height: '8vh' }} theme="dark" mode="horizontal" selectedKeys={[selectedTab]} onClick={handleTabChange}>
                        <Menu.Item key="home">Trang chủ</Menu.Item>
                        <Menu.Item key="schedule">Quản lý lịch trình</Menu.Item>
                        <Menu.Item key="route">Quản lý tuyến đường</Menu.Item>
                        <Menu.Item key="driver">Quản lý tài xế</Menu.Item>
                        <Menu.Item key="bus">Quản lý xe</Menu.Item>
                    </Menu>
                </div>
                <div>
                    <Button type="primary" icon={<LogoutOutlined />} onClick={() => { handleLogOut() }}>
                        Đăng xuất
                    </Button>
                </div>
            </Header>
            {/*  <LoadingComponent></LoadingComponent> */}
            <Content >
                <Outlet />
            </Content>
        </Layout>
    )
}

export default BusOwnerPage