import React, { useEffect, useState } from 'react'
import StatisticCard from './StatisticCard'
import { Card, Col, DatePicker, Row, Table, Tabs } from 'antd'
import { UserOutlined, CarOutlined, NodeIndexOutlined, TagOutlined, DollarOutlined, TruckOutlined } from '@ant-design/icons';
import TabPane from 'antd/es/tabs/TabPane';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getOverviewBusOwner, getStatisticBusOwner } from '../../../../../services/PartnerSevice';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { getVnCurrency } from '../../../../../utils';

const { MonthPicker, YearPicker } = DatePicker;

const Statistic = () => {
    const user = useSelector((state) => state.user);
    const [activeTab, setActiveTab] = useState('1');
    const [fixData, setFixData] = useState({
        numBus: 0,
        numDriver: 0,
        numRoute: 0,
    });
    const [flexibleData, setFlexibleData] = useState({
        numTrip: 0,
        numTicket: 0,
        revenue: 0,
        occupancyRate: []
    });
    const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [selectedMonth, setSelectedMonth] = useState(dayjs());
    const [selectedYear, setSelectedYear] = useState(dayjs().format('YYYY'));

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            width: 70,
            align: 'center',
        },
        {
            title: 'Tuyến đường',
            dataIndex: 'route',
            key: 'route',
            align: 'center',
            render: (record) => (
                <span style={{ fontSize: 16, fontWeight: '500' }}>
                    {record}
                </span>
            )
        },
        {
            title: 'Tỷ lệ lấp đầy',
            dataIndex: 'occupancyRate',
            key: 'occupancyRate',
            width: 200,
            align: 'center',
            render: (record) => (
                <span style={{ color: '#2ec429', fontWeight: '500' }}>
                    {record} %
                </span>
            )
        },
    ];

    const { data, isSuccess, isError, refetch } = useQuery({
        queryKey: ['overview'],
        queryFn: () => getOverviewBusOwner(JSON.parse(localStorage.getItem('bus_owner_id')), user?.access_token),
    });

    useEffect(() => {
        if (isSuccess) {
            setFixData(data?.data);
        } else if (isError) {
            console.log('err', data);
        }
    }, [isSuccess, isError, data]);

    const mutation = useMutation({
        mutationFn: (data) => getStatisticBusOwner(JSON.parse(localStorage.getItem('bus_owner_id')), user?.access_token, data),
        onSuccess: (data) => {
            console.log('data', data);
            setFlexibleData(data?.data);
        },
        onError: (data) => {
            console.log('error', data);
        }
    });

    useEffect(() => {
        const startOfMonth = dayjs(selectedMonth, 'MM-YYYY').startOf('month').format('YYYY-MM-DD');
        const endOfMonth = dayjs(selectedMonth, 'MM-YYYY').endOf('month').format('YYYY-MM-DD');
        mutation.mutate({
            tab: activeTab,
            startDate,
            endDate,
            startOfMonth,
            endOfMonth,
            selectedYear
        });
    }, [activeTab, startDate, endDate, selectedMonth, selectedYear]);

    return (
        <div style={{ padding: '30px', background: '#ececec', height: 'calc(100vh - 1100px)' }}>
            <Row gutter={24}>
                <Col span={8}>
                    <StatisticCard
                        title='Số lượng xe'
                        value={fixData.numBus}
                        icon={<CarOutlined style={{
                            color: 'green',
                            backgroundColor: 'rgba(0,255,0,0.25)',
                            fontSize: 36,
                            borderRadius: 32,
                            padding: 16,
                            marginRight: 20
                        }} />}
                    />
                </Col>
                <Col span={8}>
                    <StatisticCard
                        title='Số lượng tài xế'
                        value={fixData.numDriver}
                        icon={<UserOutlined style={{
                            color: 'blue',
                            backgroundColor: 'rgba(0,0,255,0.25)',
                            fontSize: 36,
                            borderRadius: 32,
                            padding: 16,
                            marginRight: 20
                        }} />}
                    />
                </Col>
                <Col span={8}>
                    <StatisticCard
                        title='Số lượng tuyến đường'
                        value={fixData.numRoute}
                        icon={<NodeIndexOutlined style={{
                            color: 'red',
                            backgroundColor: 'rgba(255,0,0,0.25)',
                            fontSize: 36,
                            borderRadius: 32,
                            padding: 16,
                            marginRight: 20
                        }} />}
                    />
                </Col>
            </Row>
            <Row>
                <Tabs activeKey={activeTab} onChange={key => setActiveTab(key)}>
                    <TabPane tab="Ngày" key="1" />
                    <TabPane tab="Tháng" key="2" />
                    <TabPane tab="Năm" key="3" />
                </Tabs>
            </Row>
            <Row align={"middle"} style={{ marginBottom: 20 }}>
                {activeTab === "1" ? (
                    <>
                        <strong>Từ</strong>
                        <DatePicker
                            format='DD/MM/YYYY'
                            style={{ width: '200px', marginLeft: 10, marginRight: 10 }}
                            placeholder='Chọn ngày'
                            defaultValue={dayjs(startDate)}
                            onChange={(time) => setStartDate(time.format('YYYY-MM-DD'))}
                            disabledDate={(current) => current && current > dayjs().endOf('day')}
                        />
                        <strong>Đến</strong>
                        <DatePicker
                            format='DD/MM/YYYY'
                            style={{ width: '200px', marginLeft: 10 }}
                            placeholder='Chọn ngày'
                            defaultValue={dayjs(endDate)}
                            onChange={(time) => setEndDate(time.format('YYYY-MM-DD'))}
                            disabledDate={(current) => current && current > dayjs().endOf('day')}
                        />
                    </>
                ) : activeTab === "2" ? (
                    <DatePicker.MonthPicker
                        format="MM-YYYY"
                        value={selectedMonth}
                        onChange={(date) => setSelectedMonth(date)}
                        placeholder="Chọn tháng"
                        style={{ width: 200 }}
                        disabledDate={(current) => current && current > dayjs().endOf('month')}
                    />
                ) : (
                    <DatePicker.YearPicker
                        format="YYYY"
                        value={dayjs(selectedYear)}
                        onChange={(date, dateString) => setSelectedYear(dateString)}
                        placeholder="Chọn năm"
                        style={{ width: 200 }}
                        disabledDate={(current) => current && current > dayjs().endOf('year')}
                    />
                )}
            </Row>
            <Row gutter={24}>
                <Col span={8} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Card title="Số lượng chuyến" bordered={false}>
                                <TruckOutlined style={{ fontSize: '24px', marginRight: '10px', color: 'green' }} />
                                <strong style={{ fontSize: 20 }}>{flexibleData.numTrip}</strong>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="Số lượng vé" bordered={false}>
                                <TagOutlined style={{ fontSize: '24px', marginRight: '10px', color: 'blue' }} />
                                <strong style={{ fontSize: 20 }}>{flexibleData.numTicket}</strong>
                            </Card>
                        </Col>
                    </Row>
                    <Card title="Doanh thu" bordered={false}>
                        <DollarOutlined style={{ fontSize: '24px', marginRight: '10px', color: 'gold' }} />
                        <strong style={{ fontSize: 20 }}>{getVnCurrency(flexibleData.revenue)}</strong>
                    </Card>
                </Col>
                <Col span={16}>
                    <Table
                        dataSource={flexibleData.occupancyRate}
                        columns={columns}
                        bordered
                        pagination={false}
                        scroll={{ y: 400 }}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default Statistic;
