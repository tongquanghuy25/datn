import './style.css'
import { Avatar, Card, Col, Rate, Row } from 'antd'
import { UserOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta'
import React from 'react'

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

const TabReview = () => {
    return (
        <div>
            {reviews?.map((review) => {
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
                            {review.avatar ? <Avatar src={review.avatar} size={64} /> : <Avatar icon={<UserOutlined />} size={64} />}
                        </Col>
                        <Col span={14}>
                            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{review.name}</div>
                            <a href={`mailto:${review.email}`} style={{ color: '#1890ff', fontSize: '14px' }}>{review.email}</a>
                        </Col>
                        <Col span={6} style={{ textAlign: 'right' }}>
                            <Rate disabled value={review.rating} style={{ fontSize: '16px' }} />
                            <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>{new Date(review.date).toLocaleDateString()}</div>
                        </Col>
                    </Row>
                    <div style={{ marginTop: '16px' }}>
                        <p style={{ fontSize: '14px', color: '#333', lineHeight: '1.5' }}>{review.content}</p>
                    </div>
                </div>
            })}

        </div>
    )
}

export default TabReview