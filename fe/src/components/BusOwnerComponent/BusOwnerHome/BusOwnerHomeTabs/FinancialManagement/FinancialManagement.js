import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Row, Col, Card, Statistic, Divider, Tabs, Tag, Space } from 'antd';
import axios from 'axios';
import { DollarOutlined, CarOutlined, UserOutlined } from '@ant-design/icons';
import { confirmRefund, getDebtsBusOwner, getDetailDebts, getRefunds } from '../../../../../services/PartnerSevice';
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux';
import { errorMes } from '../../../../Message/Message';
import { formatTimeVn, getVnCurrency } from '../../../../../utils';
import { updateSettled } from '../../../../../services/OrderService';
import TabPane from 'antd/es/tabs/TabPane';

const FinancialManagement = () => {
    const user = useSelector((state) => state.user);

    const [agents, setAgents] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalConfirm, setIsModalConfirm] = useState(false);
    const [userPayment, setUserPayment] = useState();
    const [tripDetails, setTripDetails] = useState([]);
    const [activeTab, setActiveTab] = useState('loans');
    const [refunds, setRefunds] = useState([]);

    const { data, isSuccess, isError, refetch } = useQuery({
        queryKey: ['busOwnerNotAccept'],
        queryFn: () => getDebtsBusOwner(JSON.parse(localStorage.getItem('bus_owner_id')), user?.access_token),
    });

    useEffect(() => {
        if (isSuccess) {
            setAgents(data?.data?.debtsAgent);
            setDrivers(data?.data?.debtsDriver);
        } else if (isError) {
            console.log('err', data);
        }
    }, [isSuccess, isError, data]);

    const mutation = useMutation({
        mutationFn: async (data) => {
            const { id } = data;
            return await getDetailDebts(id, JSON.parse(localStorage.getItem('bus_owner_id')));
        },
        onSuccess: (data) => {
            setTripDetails(data?.data);
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message);
        }
    });

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setIsModalVisible(true);
        mutation.mutate({ id: user.id });
    };

    const mutationPayment = useMutation({
        mutationFn: async (data) => {
            const { id } = data;
            return await updateSettled(id, JSON.parse(localStorage.getItem('bus_owner_id'), user?.access_token));
        },
        onSuccess: () => {
            message.success(`Đã xác nhận thanh toán`);
            setIsModalConfirm(false);
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message);
        }
    });

    const handleConfirmPayment = () => {
        mutationPayment.mutate({ id: userPayment.id });
    };

    const columns = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Dư nợ',
            dataIndex: 'totalDebt',
            key: 'totalDebt',
            render: (totalDebt) => `${totalDebt.toLocaleString()} VND`,
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: 250,
            render: (text, record) => (
                <span>
                    <Button type='primary' onClick={() => handleViewDetails(record)}>Chi tiết</Button>
                    <Button danger onClick={() => { setIsModalConfirm(true); setUserPayment(record) }} style={{ marginLeft: 8 }}>Thanh toán</Button>
                </span>
            ),
        },
    ];

    const columnsDetail = [
        {
            title: 'Chuyến xe',
            key: 'route',
            render: (route) => (
                `${route?.provinceStart} - ${route?.districtStart} -> ${route?.provinceEnd} - ${route?.districtEnd}`
            ),
        },
        {
            title: 'Ngày',
            dataIndex: 'departureDate',
            key: 'departureDate',
            render: (departureDate) => (
                new Date(departureDate).toLocaleDateString('vi-VN')
            ),
        },
        {
            title: 'Giờ',
            dataIndex: 'departureTime',
            key: 'departureTime',
            render: (departureTime) => (
                formatTimeVn(departureTime)
            ),
        },
        {
            title: 'Vị trí ghế',
            dataIndex: 'seatList',
            key: 'seatList',
            render: (seatList) => (
                seatList.join(', ')
            ),
        },
        {
            title: 'Tổng tiền vé',
            dataIndex: 'totalTicketPrice',
            key: 'totalTicketPrice',
            render: (totalTicketPrice) => (
                <>{totalTicketPrice.toLocaleString()} VND</>
            ),
        },
        {
            title: 'Tổng tiền hàng',
            dataIndex: 'totalOrderPrice',
            key: 'totalOrderPrice',
            render: (totalOrderPrice) => (
                <>{totalOrderPrice.toLocaleString()} VND</>
            ),
        },
        {
            title: 'Tổng số tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (text, record) => (
                <>{(record.totalTicketPrice + record.totalOrderPrice).toLocaleString()} VND</>
            ),
        },
    ];

    const totalAgentDebt = agents.reduce((sum, agent) => sum + agent.totalDebt, 0);
    const totalDriverDebt = drivers.reduce((sum, driver) => sum + driver.totalDebt, 0);


    const mutationConfirmRefund = useMutation({
        mutationFn: async (data) => {
            const { id } = data
            return await confirmRefund(id, user?.access_token);
        },
        onSuccess: (data) => {
            message.success('Xác nhận hoàn tiền thành công');
            mutationRefund.mutate()
        },
        onError: (data) => {
            message.error('Xác nhận hoàn tiền thất bại');
        }
    });

    const columnsRefund = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Số tiền',
            dataIndex: 'refundAmount',
            key: 'refundAmount',
            render: (refundAmount) => getVnCurrency(refundAmount)
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isRefund',
            key: 'isRefund',
            render: (isRefund) => (
                <Tag color={isRefund ? 'green' : 'red'}>
                    {isRefund ? 'Đã hoàn tiền' : 'Chưa hoàn tiền'}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        disabled={record.isRefund}
                        onClick={() => { mutationConfirmRefund.mutate({ id: record.id }) }}
                    >
                        Hoàn tiền
                    </Button>
                </Space>
            ),
        },
    ];

    const mutationRefund = useMutation({
        mutationFn: async () => {
            return await getRefunds(JSON.parse(localStorage.getItem('bus_owner_id')), user?.access_token);
        },
        onSuccess: (data) => {
            console.log('data?.data', data?.data);
            setRefunds(data?.data)
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message);
        }
    });

    useEffect(() => {
        if (activeTab == 'refund') {
            mutationRefund.mutate();
        }
    }, [activeTab])

    return (<div style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
        <Tabs activeKey={activeTab} onChange={key => { setActiveTab(key) }}>
            <TabPane tab="Dư nợ" key="loans">
            </TabPane>
            <TabPane tab="Hoàn tiền" key="refund">
            </TabPane>
        </Tabs>
        {activeTab === "loans" ?
            <div>
                <Row gutter={16} justify='space-between'>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="Tổng dư nợ của đại lý"
                                value={totalAgentDebt}
                                precision={0}
                                valueStyle={{ color: '#cf1322' }}
                                prefix={<DollarOutlined />}
                                suffix="VND"
                            />
                        </Card>
                        <Divider orientation="left"><CarOutlined /> Dư nợ đại lý</Divider>
                        <Table
                            dataSource={agents.map(agent => ({ ...agent, debtType: 'agent' }))}
                            pagination={false}
                            columns={columns}
                            rowKey="id"
                            style={{ marginTop: '16px', backgroundColor: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' }}
                        />
                    </Col>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="Tổng dư nợ của tài xế"
                                value={totalDriverDebt}
                                precision={0}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<DollarOutlined />}
                                suffix="VND"
                            />
                        </Card>
                        <Divider orientation="left"><UserOutlined /> Dư nợ tài xế</Divider>
                        <Table
                            dataSource={drivers.map(driver => ({ ...driver, debtType: 'driver' }))}
                            columns={columns}
                            pagination={false}
                            rowKey="id"
                            style={{ marginTop: '16px', backgroundColor: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' }}
                        />
                    </Col>
                </Row>

                {isModalVisible && (
                    <Modal
                        title={<div style={{ fontSize: '24px', fontWeight: 'bold' }}>{`Chi tiết dư nợ của ${selectedUser ? selectedUser.name : ''}`}</div>}
                        open={isModalVisible}
                        onCancel={() => setIsModalVisible(false)}
                        footer={null}
                        width='80%'
                        height='90%'
                        style={{ top: '40px' }}
                    >
                        <Table columns={columnsDetail} dataSource={tripDetails} pagination={false} rowKey="tripId"
                            style={{ marginTop: '16px', backgroundColor: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' }}

                        />
                    </Modal>
                )}
                {isModalConfirm && (
                    <Modal
                        title="Xác nhận thanh toán"
                        open={isModalConfirm}
                        onOk={() => handleConfirmPayment()}
                        okText='Xác nhận'
                        cancelText='Hủy'
                        onCancel={() => setIsModalConfirm(false)}
                    >
                        <p>Bạn có chắc chắn muốn thanh toán cho {userPayment?.name} hay không?</p>
                    </Modal>
                )}
            </div>
            :
            <div>
                <Table
                    columns={columnsRefund}
                    dataSource={refunds}
                    // loading={loading}
                    rowKey="id"
                    scroll={{ y: 410 }}
                />
            </div>
        }
    </div>

    );
};

export default FinancialManagement;
