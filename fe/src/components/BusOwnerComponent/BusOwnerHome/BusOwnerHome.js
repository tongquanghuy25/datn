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
    getItem('Thống kê', '1', <DesktopOutlined />),
    getItem('Quản lý vé', '2', <PieChartOutlined />),
    getItem('Quản lý hàng hóa', '3', <DesktopOutlined />),
    getItem('Quản lý tài chính', '4', <DesktopOutlined />),
    getItem('Thông tin tài khoản', '5', <DesktopOutlined />),
    getItem('Đổi mật khẩu', '6', <DesktopOutlined />),
    getItem('Đổi mật khẩu', '7', <DesktopOutlined />),
];


const BusOwnerHome = () => {
    const user = useSelector((state) => state.user);
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState('3');
    const [content, setContent] = useState();


    const handleSliderChange = (value) => {
        setSelectedKeys(value?.key)
    };

    useEffect(() => {
        switch (selectedKeys) {
            case '2':
                setContent(<TicketManagerment></TicketManagerment>);
                break;
            case '3':
                setContent(<GoodsManagerment></GoodsManagerment>);
                break;
            default:
                // setContent(<GoodsManagerment></GoodsManagerment>);
                break;
        }
    }, [selectedKeys])

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
                    {content}
                </Content>

            </Layout>
        </Layout >

    )
}

export default BusOwnerHome