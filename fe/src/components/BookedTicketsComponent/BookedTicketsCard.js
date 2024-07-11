import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Card, Col, Divider, Form, Popconfirm, Rate, Row, Tag } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { errorMes, successMes, warningMes } from '../../components/Message/Message';
import { createReview } from '../../services/ReviewService';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs'
import { cancelTicketOrder } from '../../services/OrderService';
import { formatTimeVn, isCancellationAllowed } from '../../utils';


const BookedTicketsCard = (props) => {
    const { ticket, setVisible, setTicketSelected, refetch } = props

    const user = useSelector((state) => state.user)
    const [isReview, setIsReview] = useState(false)
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');

    const mutation = useMutation({
        mutationFn: async (data) => {
            const { access_token, ...rest } = data;
            return await createReview(access_token, rest);
        },
        onSuccess: (data) => {
            setRating(0);
            setContent('');
            setIsReview(false)
            refetch()
            successMes(data.message)
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    });

    console.log('ticket', ticket);

    const handleSubmit = () => {
        if (rating === 0 || content.trim() === '') {
            warningMes('Vui lòng nhập đầy đủ thông tin đánh giá!');
            return;
        }
        mutation.mutate({
            access_token: user?.access_token,
            userId: user?.id,
            ticketId: ticket?.id,
            busOwnerId: ticket?.trip.busOwnerId,
            stars: rating,
            content,
            name: ticket?.name
        })
    };

    const mutationCancel = useMutation({
        mutationFn: async (data) => {
            const { id, access_token, ...rest } = data;
            return await cancelTicketOrder(id, access_token, rest);
        },
        onSuccess: () => {
            successMes('Hủy vé thành công!')
            refetch()
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    });


    const handleDeleteTicket = () => {
        const isOnTimeAllow = isCancellationAllowed(ticket.trip?.departureDate, ticket.trip?.departureTime, ticket.trip?.timeAlowCancel)
        mutationCancel.mutate({
            id: ticket?.id,
            access_token: user?.access_token,
            isOnTimeAllow: isOnTimeAllow,
            busOwnerId: ticket?.trip.busOwnerId,
            isPaid: ticket?.isPaid
        })
    }

    return (
        <div
            style={{
                marginBottom: '16px',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f5f5f5',
                transition: 'transform 0.3s, box-shadow 0.3s',
                border: '1px solid #d9d9d9',
            }}
            hoverable>
            <Row justify={'space-between'} style={{ fontSize: 20, marginBottom: 20 }}>
                <div><strong>Nhà xe : {ticket.trip.busOwner.busOwnerName}</strong> </div>
                <div style={{}}><strong>Chuyến: {ticket.trip.route.placeStart} - {ticket.trip.route.placeEnd}</strong> </div>
                <div style={{}}><strong>Ngày: {dayjs(ticket.departureDate).format('DD-MM-YYYY')}</strong> </div>

            </Row>
            <Row gutter={16}>
                <Col span={10}>
                    <div style={{ marginBottom: '8px' }}><strong>Điểm đón:</strong> {formatTimeVn(ticket.timePickUp)} - {ticket.pickUp}</div>
                    <div style={{ marginBottom: '8px' }}><strong>Điểm trả:</strong> {formatTimeVn(ticket.timeDropOff)} - {ticket.dropOff}</div>
                </Col>
                <Col span={6}>
                    <div style={{ marginBottom: '8px' }}><strong>Số ghế:</strong> {ticket.seatCount}</div>
                    <div style={{ marginBottom: '8px' }}><strong>Vị trí ghế:</strong> {JSON.parse(ticket.seats)?.join(', ')}</div>
                </Col>
                <Col span={8}>
                    <div style={{ marginBottom: '8px' }}><strong>Tổng số tiền:</strong> {ticket.totalPrice} VND

                    </div>
                    <Tag color={ticket.isPaid ? 'green' : 'red'} style={{ marginLeft: '8px' }}>
                        {ticket.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </Tag>
                </Col>
            </Row>
            <Row justify={'space-between'} style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #777' }}>


                {ticket.isReview || user?.role !== 'USER' ?
                    <div>
                    </div>
                    :
                    ticket?.status != "NotBoarded" && ticket?.status != "Canceled" && <Button size='small' type='primary' onClick={() => setIsReview(!isReview)}>Đánh giá</Button>
                }
                <Button size='small' type='default' onClick={() => { setVisible(true); setTicketSelected(ticket) }}>Chi tiết</Button>
                {
                    ticket.status === 'NotBoarded' ? <Popconfirm
                        title="Bạn có chắc chắn muốn xóa vé?"
                        onConfirm={() => { handleDeleteTicket() }}
                        okText="Đồng ý"
                        cancelText="Hủy"
                    >
                        <Button size='small' type='primary' danger >Huỷ vé</Button>
                    </Popconfirm>
                        :
                        <div></div>
                }

            </Row>

            {isReview && <Row>
                <Divider />
                <div style={{
                    width: '100%'
                }}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 'bold'
                        }}>Số sao</label>
                        <Rate value={rating} onChange={setRating} />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 'bold'
                        }}>Nội dung đánh giá</label>
                        <TextArea
                            rows={4}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={{
                                width: '100%',
                                borderRadius: '4px'
                            }}
                        />
                    </div>
                    <Button
                        type="primary"
                        onClick={() => { handleSubmit(ticket) }}

                    >
                        Gửi đánh giá
                    </Button>
                </div>
            </Row>}

        </div>
    )
}

export default BookedTicketsCard