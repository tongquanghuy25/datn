import React from 'react';
import { Layout, Menu, Breadcrumb, Table, Button, Space, Row, Col, Card, Statistic, Divider } from 'antd';
import {
    UserOutlined,
    CarOutlined,
    ShopOutlined,
    TagsOutlined,
    SettingOutlined,
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    BarChartOutlined,
    HomeOutlined,
    CalendarOutlined,
    DollarOutlined,
    SmileOutlined,
    AreaChartOutlined,
    TrophyOutlined,
    CustomerServiceOutlined,
    CheckCircleOutlined,
    ToolOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import ChartComponent from './ChartComponent';



const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <Space size="middle">
                <Button icon={<EditOutlined />} />
                <Button icon={<DeleteOutlined />} />
            </Space>
        ),
    },
];

const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
    },
];

const TestPage = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible>
                <div className="logo">
                    <h1 style={{ color: 'white' }}>Admin Panel</h1>
                </div>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    <Menu.Item key="1" icon={<HomeOutlined />}>

                    </Menu.Item>
                    <SubMenu key="sub1" icon={<UserOutlined />} title="Users">
                        <Menu.Item key="2">Manage Users</Menu.Item>
                        <Menu.Item key="3">Permissions</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" icon={<CarOutlined />} title="Vehicles">
                        <Menu.Item key="4">Manage Vehicles</Menu.Item>
                        <Menu.Item key="5">Add Vehicle</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub3" icon={<ShopOutlined />} title="Companies">
                        <Menu.Item key="6">Manage Companies</Menu.Item>
                        <Menu.Item key="7">Add Company</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub4" icon={<TagsOutlined />} title="Discount Codes">
                        <Menu.Item key="8">List</Menu.Item>
                        <Menu.Item key="9">Create</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="10" icon={<SettingOutlined />}>
                        Settings
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">

                {/* <Content style={{ margin: '16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Admin</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                        <Table columns={columns} dataSource={data} />
                    </div>
                </Content> */}
                <Content style={{ padding: '0 50px', marginTop: 64 }}>
                    {/* <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Admin</Breadcrumb.Item>
                        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
                    </Breadcrumb> */}
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <Card>
                                    <Statistic
                                        title="Total Users"
                                        value={300}
                                        prefix={<UserOutlined />}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <Card>
                                    <Statistic
                                        title="Total Vehicles"
                                        value={150}
                                        prefix={<CarOutlined />}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <Card>
                                    <Statistic
                                        title="Total Companies"
                                        value={50}
                                        prefix={<ShopOutlined />}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <Card>
                                    <Statistic
                                        title="Total Discount Codes"
                                        value={20}
                                        prefix={<TagsOutlined />}
                                    />
                                </Card>
                            </Col>
                        </Row>
                        <Divider />
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <Card>
                                    <Statistic
                                        title="Monthly Revenue"
                                        value={10000}
                                        prefix={<DollarOutlined />}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <Card>
                                    <Statistic
                                        title="Active Trips"
                                        value={200}
                                        prefix={<CalendarOutlined />}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <Card>
                                    <Statistic
                                        title="Customer Satisfaction"
                                        value={95}
                                        suffix="%"
                                        prefix={<SmileOutlined />}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <Card>
                                    <Statistic
                                        title="Average Response Time"
                                        value={15}
                                        suffix="min"
                                        prefix={<ClockCircleOutlined />}
                                    />
                                </Card>
                            </Col>
                        </Row>
                        <Divider />
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <Card>
                                    <Statistic
                                        title="Cancellation Rate"
                                        value={5}
                                        suffix="%"
                                        prefix={<CheckCircleOutlined />}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <Card>
                                    <Statistic
                                        title="Maintenance Scheduled"
                                        value={10}
                                        prefix={<ToolOutlined />}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <Card>
                                    <Statistic
                                        title="Pending Reservations"
                                        value={30}
                                        prefix={<CustomerServiceOutlined />}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <Card>
                                    <Statistic
                                        title="Successful Trips"
                                        value={150}
                                        prefix={<TrophyOutlined />}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Admin Panel</Footer>
            </Layout>
        </Layout>
    );
};

export default TestPage;