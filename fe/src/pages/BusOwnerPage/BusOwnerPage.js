import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import DriverManagement from '../../components/BusOwnerComponent/DriverManagerment/DriverManagement';
import LoadingComponent from '../../components/Loading/LoadingComponent';
import BusManagerment from '../../components/BusOwnerComponent/BusManagerment/BusManagerment';
import { useNavigate } from 'react-router-dom';
import RouteManagerment from '../../components/BusOwnerComponent/RouteManagerment/RouteManagerment';
import TripManagerment from '../../components/BusOwnerComponent/TripManagerment/TripManagerment';
import { useHandleLogout } from '../../utils/Action/HandleLogOut';


const { Header, Content } = Layout;
const BusOwnerPage = () => {
    const [selectedTab, setSelectedTab] = useState('tab1');
    const navigate = useNavigate();


    const handleTabChange = ({ key }) => {
        setSelectedTab(key);
    };


    const handleLogOut = useHandleLogout()

    return (
        <Layout style={{ backgroundColor: '#fff' }}>
            <Header style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ color: 'white', margin: 0 }}>Trang nhà xe</h1>
                </div>
                <div style={{ flex: 1, marginLeft: '80px' }}>
                    <Menu theme="dark" mode="horizontal" selectedKeys={[selectedTab]} onClick={handleTabChange}>
                        <Menu.Item key="home">Trang chủ</Menu.Item>
                        <Menu.Item key="trip">Quản lý chuyến</Menu.Item>
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
            <Content style={{ padding: '0 20px' }}>
                {selectedTab === 'home' && <LoadingComponent></LoadingComponent>}
                {selectedTab === 'driver' && <DriverManagement></DriverManagement>}
                {selectedTab === 'trip' && <TripManagerment></TripManagerment>}
                {selectedTab === 'route' && <RouteManagerment></RouteManagerment>}
                {selectedTab === 'bus' && <BusManagerment></BusManagerment>}
            </Content>
        </Layout>
    )
}

export default BusOwnerPage