import React, { useEffect, useState } from 'react'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import { useQuery } from '@tanstack/react-query';
import { getTicketsByUser } from '../../services/OrderService';
import { useSelector } from 'react-redux';
import { Card, Col, Divider, Row, Tag } from 'antd';

const tripData = [
    {
        createdAt: "2024-05-23T14:08:15.056Z",
        dateDropOff: "22/5/2024",
        datePickUp: "22/5/2024",
        departureDate: "22/05/2024",
        dropOff: "Cầu Tu",
        email: "u2@gmail.com",
        extraCosts: 20000,
        isCancel: false,
        isFinish: false,
        isPaid: true,
        name: "1231",
        paidAt: "2024-05-23T14:08:12.000Z",
        payee: "662f726cf4e64a08e996b749",
        paymentMethod: "paypal",
        phone: "01234567894",
        pickUp: "Đại học Bách Khoa",
        seatCount: 2,
        seats: ['A5', 'A6'],
        status: "Chưa lên xe",
        ticketPrice: 100000,
        timeDropOff: "8:35",
        timePickUp: "6:35",
        totalPrice: 220000,
        tripId: "664db77c65a19e0a50b6c845",
        updatedAt: "2024-05-23T14:08:15.056Z",
        userOrder: "662f726cf4e64a08e996b749",
        __v: 0,
        _id: "664f4dcf21733b3d12c69001",
        busOwnerName: "Quang Huy",
        routeName: "Hà Nội-Ninh Bình",
    },
    {
        createdAt: "2024-05-23T14:08:15.056Z",
        dateDropOff: "22/5/2024",
        datePickUp: "22/5/2024",
        departureDate: "22/05/2024",
        dropOff: "Cầu Tu",
        email: "u2@gmail.com",
        extraCosts: 20000,
        isCancel: false,
        isFinish: false,
        isPaid: true,
        name: "1231",
        paidAt: "2024-05-23T14:08:12.000Z",
        payee: "662f726cf4e64a08e996b749",
        paymentMethod: "paypal",
        phone: "01234567894",
        pickUp: "Đại học Bách Khoa",
        seatCount: 2,
        seats: ['A5', 'A6'],
        status: "Chưa lên xe",
        ticketPrice: 100000,
        timeDropOff: "8:35",
        timePickUp: "6:35",
        totalPrice: 220000,
        tripId: "664db77c65a19e0a50b6c845",
        updatedAt: "2024-05-23T14:08:15.056Z",
        userOrder: "662f726cf4e64a08e996b749",
        __v: 0,
        _id: "664f4dcf21733b3d12c69001",
        busOwnerName: "Quang Huy",
        routeName: "Hà Nội-Ninh Bình",
    }
]

const BookedTicketsPage = () => {
    const user = useSelector((state) => state.user)
    const [listTicket, setListTicket] = useState([])

    const { data, isSuccess, isError, refetch } = useQuery(
        {
            queryKey: ['tickets'],
            queryFn: () => getTicketsByUser(user?.access_token, user?.id),
        });

    useEffect(() => {
        if (isSuccess) {
            console.log('kk', data);
            setListTicket(data?.data)
        } else if (isError) {
            console.log('err', data);
        }
    }, [isSuccess, isError, data])

    console.log('lus', listTicket);

    return (
        <div>
            <HeaderComponent />
            <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
                {listTicket?.map(tripData => {
                    return <Card title={`Chuyến: ${tripData.routeName}`} style={{ marginBottom: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <p><strong>Nhà xe:</strong> {tripData.busOwnerName}</p>
                                <p><strong>Ngày đón:</strong> {tripData.datePickUp}</p>
                                <p><strong>Giờ đón:</strong> {tripData.timePickUp}</p>
                                <p><strong>Điểm đón:</strong> {tripData.pickUp}</p>
                                <Divider />
                                <p><strong>Ngày trả:</strong> {tripData.dateDropOff}</p>
                                <p><strong>Giờ trả:</strong> {tripData.timeDropOff}</p>
                                <p><strong>Điểm trả:</strong> {tripData.dropOff}</p>
                            </Col>
                            <Col span={12}>
                                <p><strong>Vị trí ghế:</strong> {tripData.seats.join(', ')}</p>
                                <p><strong>Số ghế:</strong> {tripData.seatCount}</p>
                                <p><strong>Tổng số tiền:</strong> {tripData.totalPrice.toLocaleString()} VND</p>
                                <p><strong>Trạng thái:</strong> {tripData.status}</p>
                                <p><strong>Trạng thái thanh toán:</strong> <Tag color={tripData.isPaid ? 'green' : 'red'}>{tripData.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</Tag></p>
                            </Col>
                        </Row>
                    </Card>
                })}
            </div>
        </div>
    )
}

export default BookedTicketsPage