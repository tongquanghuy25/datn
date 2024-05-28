import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Card, Col, Divider, Form, Rate, Row, Tag } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { errorMes, successMes, warningMes } from '../../components/Message/Message';
import { createReview } from '../../services/ReviewService';
import { useSelector } from 'react-redux';


const BookedTicketsCard = (props) => {
    const { ticket, refetch } = props

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

    const handleSubmit = () => {
        if (rating === 0 || content.trim() === '') {
            warningMes('Vui lòng nhập đầy đủ thông tin đánh giá!');
            return;
        }
        mutation.mutate({
            access_token: user?.access_token,
            userId: user?.id,
            ticketId: ticket?._id,
            busOwnerId: ticket?.tripId.busOwnerId,
            stars: rating,
            content,
            name: ticket?.name
        })
    };
    return (
        <div>
            <Card title={`Nhà xe : ${ticket.busOwnerName}, Chuyến: ${ticket.routeName}, Ngày: ${ticket.departureDate}`}
                style={{
                    marginBottom: '16px',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#f5f5f5',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    border: '1px solid #d9d9d9',
                }}
                hoverable>
                <Row gutter={16}>
                    <Col span={8}>
                        <div style={{ marginBottom: '8px' }}><strong>Điểm đón:</strong> {ticket.timePickUp} - {ticket.pickUp}</div>
                        <div style={{ marginBottom: '8px' }}><strong>Điểm trả:</strong> {ticket.timeDropOff} - {ticket.dropOff}</div>
                    </Col>
                    <Col span={6}>
                        <div style={{ marginBottom: '8px' }}><strong>Số ghế:</strong> {ticket.seatCount}</div>
                        <div style={{ marginBottom: '8px' }}><strong>Vị trí ghế:</strong> {ticket.seats?.join(', ')}</div>
                    </Col>
                    <Col span={10}>
                        <div style={{ marginBottom: '8px' }}><strong>Tổng số tiền:</strong> {ticket.totalPrice} VND
                            <Tag color={ticket.isPaid ? 'green' : 'red'} style={{ marginLeft: '8px' }}>
                                {ticket.sPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                            </Tag>
                        </div>
                        {ticket.status === 'Đã hoàn thành' ?
                            <div style={{ marginBottom: '8px' }}><strong>Trạng thái:</strong> {ticket.status}</div>
                            :
                            <>
                                {ticket.isReview ?
                                    <>
                                    </>
                                    :
                                    <Row justify={'center'}>
                                        <Button size='small' type='primary' onClick={() => setIsReview(!isReview)}>Đánh giá</Button>
                                    </Row>
                                }
                            </>
                        }
                    </Col>
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
            </Card>
        </div>
    )
}

export default BookedTicketsCard