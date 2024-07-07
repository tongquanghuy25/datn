import React, { useState, useEffect } from 'react';
import { Table, Card, Statistic, Row, Col, Layout } from 'antd';
import axios from 'axios';
import './style.css'; // Import file CSS
import { useSelector } from 'react-redux';
import { getDebtsAgent } from '../../../services/PartnerSevice';
import { useQuery } from '@tanstack/react-query';
import { DollarOutlined, BarChartOutlined, RiseOutlined } from '@ant-design/icons';
import { getVnCurrency } from '../../../utils';

const { Content } = Layout;

const FinancialComponent = () => {
    const [loading, setLoading] = useState(true);

    const user = useSelector((state) => state.user);
    const [groupedData, setGroupedData] = useState([]);
    const [totalStats, setTotalStats] = useState({
        totalDebt: 0,
        totalRevenue: 0,
        totalTicketsSold: 0
    });


    const { data, isSuccess, isError, refetch } = useQuery(
        {
            queryKey: ['busOwnerNotAccept'],
            queryFn: () => getDebtsAgent(user?.id, user?.access_token),
        });

    console.log(groupedData, totalStats);

    useEffect(() => {
        if (isSuccess) {
            console.log('data222', data);
            setGroupedData(data?.data.groupedDataArray)
            setTotalStats(data?.data.totalStats)

        } else if (isError) {
            console.log('err', data);
        }

    }, [isSuccess, isError, data])



    const columns = [
        { title: 'Nhà Xe', dataIndex: 'busOwnerName', key: 'busOwnerName' },
        { title: 'Số Vé Đã Bán', dataIndex: 'ticketsSold', key: 'ticketsSold' },
        {
            title: 'Tổng Doanh Thu', dataIndex: 'totalRevenue', key: 'totalRevenue',
            render: value => getVnCurrency(value)
        },
        {
            title: 'Dư Nợ', dataIndex: 'debt', key: 'debt',
            render: value => getVnCurrency(value)
        },
    ];

    // const totalTicketsSold = data1.reduce((sum, record) => sum + record.ticketsSold, 0);
    // const totalRevenue = data1.reduce((sum, record) => sum + record.totalRevenue, 0);
    // const totalDebt = data1.reduce((sum, record) => sum + record.debt, 0);

    return (
        <Layout className="financial-layout">
            <Content className="financial-content">
                <Row gutter={16}>
                    <Col span={8}>
                        <Card className="statistic-card" bordered={false}>
                            <BarChartOutlined className="statistic-icon" style={{ color: '#1890ff' }} />
                            <Statistic title="Tổng Vé Đã Bán" value={totalStats?.totalTicketsSold} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card className="statistic-card" bordered={false}>
                            <DollarOutlined className="statistic-icon" style={{ color: '#faad14' }} />
                            <Statistic title="Tổng Doanh Thu" value={getVnCurrency(totalStats?.totalRevenue)} valueStyle={{ color: '#cf1322' }} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card className="statistic-card" bordered={false}>
                            <RiseOutlined className="statistic-icon" style={{ color: '#52c41a' }} />
                            <Statistic title="Tổng Dư Nợ" value={getVnCurrency(totalStats?.totalDebt)} valueStyle={{ color: '#d46b08' }} />
                        </Card>
                    </Col>
                </Row>
                <Table
                    columns={columns}
                    dataSource={groupedData}
                    // loading={loading}
                    rowKey="busOwnerName"
                    style={{ marginTop: 20 }}
                    className="financial-table"
                />
            </Content>
        </Layout>
    );
};

export default FinancialComponent;
