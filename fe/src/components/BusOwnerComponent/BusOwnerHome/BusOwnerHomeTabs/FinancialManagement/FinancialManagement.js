import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Row, Col, Card, Statistic, Divider } from 'antd';
import axios from 'axios';
import { DollarOutlined, CarOutlined, UserOutlined } from '@ant-design/icons';
import { getDebtsBusOwner, getDetailDebts } from '../../../../../services/PartnerSevice';
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux';
import { errorMes } from '../../../../Message/Message';
import { formatTimeVn } from '../../../../../utils';
import { updateSettled } from '../../../../../services/OrderService';


const FinancialManagement = () => {

    const user = useSelector((state) => state.user);


    const [agents, setAgents] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalConfirm, setIsModalConfirm] = useState(false);
    const [userPayment, setUserPayment] = useState();
    const [tripDetails, setTripDetails] = useState([]);


    const { data, isSuccess, isError, refetch } = useQuery(
        {
            queryKey: ['busOwnerNotAccept'],
            queryFn: () => getDebtsBusOwner(JSON.parse(localStorage.getItem('bus_owner_id')), user?.access_token),
        });

    useEffect(() => {
        if (isSuccess) {
            // setPartnerNotAccept(data?.data)
            console.log(data?.data);
            setAgents(data?.data?.debtsAgent);
            setDrivers(data?.data?.debtsDriver);
        } else if (isError) {
            console.log('err', data);
        }

    }, [isSuccess, isError, data])

    const mutation = useMutation({
        mutationFn: async (data) => {
            const { id } = data;
            return await getDetailDebts(id, JSON.parse(localStorage.getItem('bus_owner_id')));
        },
        onSuccess: (data) => {
            setTripDetails(data?.data);
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    });

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setIsModalVisible(true);
        mutation.mutate({ id: user.id })
    };


    const mutationPayment = useMutation({
        mutationFn: async (data) => {
            const { id } = data;
            return await updateSettled(id, JSON.parse(localStorage.getItem('bus_owner_id')));
        },
        onSuccess: () => {
            message.success(`Đã xác nhận thanh toán`);
            setIsModalConfirm(false)
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    });


    const handleConfirmPayment = () => {
        mutationPayment.mutate({ id: userPayment.id })
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
            render: (route) => {
                console.log('route', route);
                return `${route?.provinceStart} - ${route?.districtStart} -> ${route?.provinceEnd} - ${route?.districtEnd}`
            },
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
                <>
                    {record.totalTicketPrice + record.totalOrderPrice} VND
                </>
            ),
        },
    ];

    const totalAgentDebt = agents.reduce((sum, agent) => sum + agent.totalDebt, 0);
    const totalDriverDebt = drivers.reduce((sum, driver) => sum + driver.totalDebt, 0);
    return (
        <div style={{ padding: 30 }}>
            <Row gutter={16} justify={'space-between'}>
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
                    <Table dataSource={agents.map(agent => ({ ...agent, debtType: 'agent' }))} pagination={false} columns={columns} rowKey="id" />
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
                    <Table dataSource={drivers.map(driver => ({ ...driver, debtType: 'driver' }))} columns={columns} pagination={false} rowKey="id" />
                </Col>
            </Row>

            {
                isModalVisible && <Modal
                    title={<div style={{ fontSize: 24, fontWeight: 'bold' }}>{`Chi tiết dư nợ của ${selectedUser ? selectedUser.name : ''}`}</div>}
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    width={'80%'}
                    height={'90%'}
                    style={{
                        top: 40,
                    }}
                >
                    <Table columns={columnsDetail} dataSource={tripDetails} pagination={false} rowKey="tripId" />
                </Modal>
            }
            {
                isModalConfirm && <Modal
                    title="Xác nhận thanh toán"
                    open={isModalConfirm}
                    onOk={() => handleConfirmPayment()}
                    okText='Xác nhận'
                    cancelText='Hủy'
                    onCancel={() => setIsModalConfirm(false)}
                >
                    <p>Bạn có chắc chắn muốn thanh toán cho {userPayment?.name} hay không?</p>
                </Modal>
            }
        </div>
    )
}

export default FinancialManagement