import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import DriverManagement from '../../components/BusOwnerComponent/DriverManagerment/DriverManagement';
import LoadingComponent from '../../components/Loading/LoadingComponent';
import BusManagerment from '../../components/BusOwnerComponent/BusManagerment/BusManagerment';
import { logoutUser } from '../../services/UserService';
import { useDispatch } from 'react-redux';
import { resetUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';


const { Header, Content } = Layout;
const BusOwnerPage = () => {
    const [selectedTab, setSelectedTab] = useState('tab1');
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleTabChange = ({ key }) => {
        setSelectedTab(key);
    };

    const handleLogout = async () => {
        await logoutUser()
        dispatch(resetUser());
        localStorage.clear();
        navigate('/sign-in')
    }
    return (
        <Layout style={{ backgroundColor: '#fff' }}>
            <Header style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ color: 'white', margin: 0 }}>Trang nhà xe</h1>
                </div>
                <div style={{ flex: 1, marginLeft: '80px' }}>
                    <Menu theme="dark" mode="horizontal" selectedKeys={[selectedTab]} onClick={handleTabChange}>
                        <Menu.Item key="tab1">Trang chủ</Menu.Item>
                        <Menu.Item key="tab6">Quản lý chuyến</Menu.Item>
                        <Menu.Item key="tab2">Quản lý tuyến đường</Menu.Item>
                        <Menu.Item key="driver">Quản lý tài xế</Menu.Item>
                        <Menu.Item key="tab4">Quản lý xe</Menu.Item>
                        <Menu.Item key="tab5"></Menu.Item>
                    </Menu>
                </div>
                <div>
                    <Button type="primary" icon={<LogoutOutlined />} onClick={handleLogout}>
                        Đăng xuất
                    </Button>
                </div>
            </Header>
            <Content style={{ padding: '0 20px' }}>
                {selectedTab === 'driver' && <DriverManagement></DriverManagement>}
                {selectedTab === 'tab2' && <LoadingComponent></LoadingComponent>}
                {selectedTab === 'tab3' && 'TabContent3'}
                {selectedTab === 'tab4' && <BusManagerment></BusManagerment>}
                {selectedTab === 'tab5' && 'TabContent5'}
            </Content>
        </Layout>
    )
}

export default BusOwnerPage