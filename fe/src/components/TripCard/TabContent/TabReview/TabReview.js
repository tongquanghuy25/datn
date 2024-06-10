import './style.css'
import { Avatar, Card, Col, Rate, Row, Tag } from 'antd'
import { UserOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta'
import React, { useEffect, useState } from 'react'
import { getReviewsByBusOwner } from '../../../../services/ReviewService';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';

const reviews = [
    {
        avatar: 'https://example.com/avatar1.jpg',
        name: 'John Doe',
        email: 'john.doe@example.com',
        rating: 4,
        date: '2023-05-21T00:00:00Z',
        content: 'This product is amazing! I really enjoyed using it.',
    },
    {
        avatar: '',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        rating: 5,
        date: '2023-05-20T00:00:00Z',
        content: 'Excellent product, highly recommend!',
    },
];

const TabReview = (props) => {
    const { busOwnerId } = props
    const [listReview, setlistReview] = useState([])


    const user = useSelector((state) => state.user)


    const { data, isSuccess, isError, refetch } = useQuery(
        {
            queryKey: ['reviews'],
            queryFn: () => getReviewsByBusOwner(user?.access_token, busOwnerId),
        });

    useEffect(() => {
        if (isSuccess) {
            setlistReview(data?.data)
        } else if (isError) {
            console.log('err', data);
        }
    }, [isSuccess, isError, data])

    console.log('lisr', listReview);

    return (
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {listReview?.map((review) => {
                return <div style={{
                    border: '1px solid #f0f0f0',
                    borderRadius: '8px',
                    padding: '8px',
                    marginBottom: '16px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#fff'
                }}>
                    <Row gutter={16}>
                        <Col span={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {review.userId?.avatar ? <Avatar src={review.userId?.avatar} size={64} /> : <Avatar icon={<UserOutlined />} size={64} />}
                        </Col>
                        <Col span={8}>
                            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{review.name ? review.name : 'Chưa có tên'}</div>
                            <a href={`mailto:${review.userId?.email}`} style={{ color: '#1890ff', fontSize: '14px' }}>{review.user?.email}</a>
                        </Col>
                        <Col span={6}>
                            <Tag color='green'>Đã mua vé</Tag>
                        </Col>
                        <Col span={6} style={{ textAlign: 'right' }}>
                            <Rate disabled value={review.stars} style={{ fontSize: '16px' }} />
                            <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>{new Date(review.createdAt).toLocaleDateString()}</div>
                        </Col>
                    </Row>
                    <div style={{ margin: '16px 20px 0px 20px' }}>
                        <p style={{ fontSize: '14px', color: '#333', lineHeight: '1.5' }}>{review.content}</p>
                    </div>
                </div>
            })}

        </div>
    )
}

export default TabReview