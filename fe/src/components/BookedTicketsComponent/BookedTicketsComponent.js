import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTicketByCode, getTicketsByUser } from '../../services/OrderService';
import { useSelector } from 'react-redux';
import { Button, Card, Col, Divider, Form, Input, Modal, Rate, Row, Tabs, Tag } from 'antd';
import { errorMes, successMes, warningMes } from '../../components/Message/Message';
import BookedTicketsCard from '../../components/BookedTicketsComponent/BookedTicketsCard';
import dayjs from 'dayjs'
import { formatTimeVn } from '../../utils';
import TabPane from 'antd/es/tabs/TabPane';
import nodata from '../../acess/nodata.jpg'


const BookedTicketsComponent = () => {
    const user = useSelector((state) => state.user)
    const [listTicket, setListTicket] = useState([])
    const [ticketSelected, setTicketSelected] = useState()
    const [isSearch, setIsSearch] = useState(false)
    const [visible, setVisible] = useState(false)
    const [ticketCode, setTicketCode] = useState('')
    const [phone, setPhone] = useState('')
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('1');



    const { data, isSuccess, isError, refetch } = useQuery(
        {
            queryKey: ['tickets', activeTab],
            queryFn: () => {
                let statuses
                if (activeTab === '1') {
                    statuses = ['NotBoarded', 'Boarded']
                } else if (activeTab === '2') {
                    statuses = ['Completed', 'Settled']
                } else
                    statuses = ['Canceled']
                return getTicketsByUser(user?.access_token, user?.id, statuses)
            },
        });

    useEffect(() => {
        if (isSuccess) {
            console.log('getdataa');
            setListTicket(data?.data)
        } else if (isError) {
            console.log('err', data);
        }
    }, [isSuccess, isError, data])

    const mutation = useMutation({
        mutationFn: async (data) => {
            return await getTicketByCode(data);
        },
        onSuccess: (data) => {
            setListTicket([data?.data])
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    });


    const handleSearch = () => {
        setListTicket([])
        mutation.mutate({ ticketCode, phone })
        setIsSearch(true)
    }
    const handleCancelSearch = () => {
        const list = queryClient.getQueryData(['tickets'])?.data
        if (list?.length > 0) setListTicket(queryClient.getQueryData(['tickets'])?.data)
        else refetch()
        setTicketCode('')
        setPhone('')
        setIsSearch(false)
    }

    console.log('listTicket', listTicket);

    return (
        <div>
            <Row style={{ marginTop: '20px' }} justify={'center'}>
                <Input
                    style={{ width: '200px', marginRight: '20px' }}
                    placeholder='Nhập id vé'
                    value={ticketCode}
                    onChange={e => setTicketCode(e.target.value)}
                />
                <Input
                    style={{ width: '200px', marginRight: '20px' }}
                    placeholder='Nhập số điện thoại'
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                />
                {
                    // !isSearch ? <Button type='primary' onClick={handleSearch}>Tìm kiếm</Button>
                    //     : <Button type='primary' danger onClick={handleCancelSearch}>Xóa tìm kiếm</Button>
                    <Button type='primary' onClick={handleSearch}>Tìm kiếm</Button>
                }
            </Row>
            {
                <>
                    <Row justify={'center'}>
                        {
                            isSearch || !user.id ?
                                listTicket?.length > 0 && <h2>Thông tin vé</h2>
                                :
                                <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)} style={{ marginTop: '20px' }}>
                                    <TabPane tab="Chưa hoàn thành" key="1"></TabPane>
                                    <TabPane tab="Đã hoàn thành" key="2"> </TabPane>
                                    <TabPane tab="Đã hủy" key="3"></TabPane>
                                </Tabs>
                        }
                    </Row>
                    {listTicket?.length > 0 ? <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        {listTicket?.map(ticket => {
                            return <BookedTicketsCard
                                ticket={ticket}
                                setVisible={setVisible}
                                setTicketSelected={setTicketSelected}
                                refetch={refetch} />
                        })}
                    </div>
                        :
                        <div style={{ fontSize: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                            <img src={nodata} style={{ maxWidth: '200px' }}></img>
                            <h2>Chưa có đơn vé nào</h2>
                        </div>
                    }
                </>
            }

            {visible &&
                <Modal
                    title={<div style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>Chi tiết vé</div>}
                    open={visible}
                    footer={null}
                    width={600}
                    onCancel={() => {
                        setVisible(false)
                    }}
                >
                    <div style={{ fontSize: '16px' }}>

                        <Row style={{ fontSize: '16px', margin: '20px 0 10px 0' }}>
                            <div><strong>Email:</strong> {ticketSelected?.email}</div>
                            <div style={{ marginLeft: '30px' }}><strong>Điện Thoại:</strong> {ticketSelected?.phone}</div>
                        </Row>
                        <div ><strong>Ngày Khởi Hành:</strong> {dayjs(ticketSelected?.departureDate).format('DD-MM-YYYY')}</div>

                        <Row style={{ margin: '10px 0' }} >
                            <Col span={12} style={{ fontSize: '16px' }}>
                                <div><strong>Nơi Đón:</strong> {ticketSelected?.pickUp}</div>
                                <div><strong>Thời Gian Đón:</strong> {formatTimeVn(ticketSelected?.timePickUp)}</div>
                                <div><strong>Ngày Đón:</strong> {dayjs(ticketSelected?.datePickUp).format('DD-MM-YYYY')}</div>
                                <div><strong>Ghi Chú Nơi Đón:</strong> {ticketSelected?.notePickUp}</div>
                            </Col>
                            <Col span={12} style={{ fontSize: '16px' }}>
                                <div><strong>Nơi Trả:</strong> {ticketSelected?.dropOff}</div>
                                <div><strong>Thời Gian Trả:</strong> {formatTimeVn(ticketSelected?.timeDropOff)}</div>
                                <div><strong>Ngày Trả:</strong> {dayjs(ticketSelected?.dateDropOff).format('DD-MM-YYYY')}</div>
                                <div><strong>Ghi Chú Nơi Trả:</strong> {ticketSelected?.noteDropOff}</div>
                            </Col>
                        </Row>



                        <div><strong>Số Lượng Ghế:</strong> {ticketSelected?.seatCount}</div>
                        <div style={{ marginBottom: '10px' }}><strong>Ghế Đặt:</strong> {ticketSelected?.seats.toString()}</div>

                        <div><strong>Giá Vé:</strong> {ticketSelected?.ticketPrice}</div>
                        <div><strong>Phụ Phí:</strong> {ticketSelected?.extraCosts}</div>
                        <div><strong>Giảm Giá:</strong> {ticketSelected?.discount}</div>
                        <div style={{ marginBottom: '10px' }}><strong>Tổng Tiền:</strong> {ticketSelected?.totalPrice}</div>

                        <div><strong>Phương Thức Thanh Toán:</strong> {ticketSelected?.paymentMethod}</div>
                        <div><strong>Thanh Toán:</strong> {ticketSelected?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
                        <div><strong>Trạng Thái:</strong> {ticketSelected?.status}</div>
                    </div>
                </Modal>
            }
        </div>
    )
}

export default BookedTicketsComponent