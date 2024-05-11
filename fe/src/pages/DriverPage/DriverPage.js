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
import { Footer } from 'antd/es/layout/layout';
import RunningTripComponent from '../../components/DriverComponent/RunningTripComponent/RunningTripComponent';
import ListMyTripComponent from '../../components/DriverComponent/ListMyTripComponent/ListMyTripComponent';
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
    getItem('Chuyến xe đang chạy', '1', <PieChartOutlined />),
    getItem('Chuyến xe của tôi', '2', <DesktopOutlined />),
    getItem('Thống kê', '3', <DesktopOutlined />),
    getItem('Thông tin tài khoản', '4', <DesktopOutlined />),
    getItem('Đổi mật khẩu', '5', <DesktopOutlined />),
    // getItem('Chuyến đang chạy', '3', <DesktopOutlined />),
    // getItem('User', 'sub1', <UserOutlined />, [
    //     getItem('Tom', '3'),
    //     getItem('Bill', '4'),
    //     getItem('Alex', '5'),
    // ]),
    // getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    // getItem('Files', '9', <FileOutlined />),
];


const DriverPage = () => {
    const user = useSelector((state) => state.user);
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState('1');
    const [content, setContent] = useState();

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleSliderChange = (value) => {
        setSelectedKeys(value?.key)
    };

    useEffect(() => {
        switch (selectedKeys) {
            case '1':
                setContent(<RunningTripComponent></RunningTripComponent>);
                // content = <Component1 />;
                break;
            case '2':
                setContent(<ListMyTripComponent setSelectedKeys={setSelectedKeys}></ListMyTripComponent>);
                // content = <Component2 />;
                break;
            default:
                break;
        }
    }, [selectedKeys])

    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider
                trigger={null}

            // collapsible
            // collapsed={collapsed}
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
            </Sider>
            <Layout>
                {/* <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header> */}
                <Content
                    style={{
                        // margin: '24px 16px',
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {content}
                </Content>
                {/* <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer> */}
            </Layout>
        </Layout >

        // <Layout
        //     style={{
        //         minHeight: '100vh',
        //     }}
        // >
        //     <Sider trigger={null} collapsible collapsed={collapsed} style={{ background: siderBg }}>
        //         <div className="demo-logo-vertical" />
        //         <Menu
        //             theme="dark"
        //             mode="inline"
        //             defaultSelectedKeys={['1']}
        //             items={items}
        //         />
        //     </Sider>
        //     <Layout>
        //         <Header
        //             style={{
        //                 padding: 0,
        //                 background: headerBg,
        //                 color: headerColor,
        //                 height: headerHeight,
        //                 padding: headerPadding,
        //             }}
        //         >
        //             <Button
        //                 type="text"
        //                 icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        //                 onClick={() => setCollapsed(!collapsed)}
        //                 style={{
        //                     fontSize: '16px',
        //                     width: 64,
        //                     height: 64,
        //                     background: triggerBg,
        //                     color: triggerColor,
        //                 }}
        //             />
        //         </Header>
        //         <Content
        //             style={{
        //                 padding: 24,
        //                 minHeight: 280,
        //                 background: colorBgContainer,
        //                 borderRadius: borderRadiusLG,
        //             }}
        //         >
        //             Content
        //         </Content>
        //         {/* <Footer
        //         style={{
        //             textAlign: 'center',
        //             background: footerBg,
        //             padding: footerPadding,
        //         }}
        //     >
        //         Ant Design ©{new Date().getFullYear()} Created by Ant UED
        //     </Footer> */}
        //     </Layout>
        // </Layout>
    );
}

export default DriverPage
