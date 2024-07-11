import React from 'react';
import { Card, Col, Row } from 'antd';
import { MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import FooterComponent from '../../components/FooterComponent/FooterComponent';

const ContactPage = () => {
    const contactData = [
        {
            icon: <MailOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '10px' }} />,
            title: 'Email',
            description: 'vexere@gmail.com',
        },
        {
            icon: <PhoneOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '10px' }} />,
            title: 'Điện thoại',
            description: '0978789666',
        },
        {
            icon: <HomeOutlined style={{ fontSize: '48px', color: '#eb2f96', marginBottom: '10px' }} />,
            title: 'Địa chỉ',
            description: 'Tòa B1 Đại học Bách khoa Hà Nội',
        },
    ];

    const cardStyle = {
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s, box-shadow 0.3s',
    };

    const hoverStyle = {
        transform: 'scale(1.05)',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    };

    return (
        <>
            <HeaderComponent />
            <div style={{ padding: '20px', paddingTop: 100, backgroundColor: '#f0f2f5', minHeight: 'calc(100vh - 440px)' }}>
                <Row justify="center" gutter={[16, 16]}>
                    {contactData.map((contact, index) => (
                        <Col xs={24} sm={12} md={8} key={index}>
                            <Card
                                hoverable
                                style={cardStyle}
                                bodyStyle={{ textAlign: 'center', padding: '20px' }}
                                onHover={() => ({ ...hoverStyle })}
                            >
                                {contact.icon}
                                <Card.Meta
                                    title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>{contact.title}</span>}
                                    description={<span style={{ fontSize: '16px', color: '#555' }}>{contact.description}</span>}
                                    style={{ marginTop: '10px' }}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
            <FooterComponent />
        </>
    );
};

export default ContactPage;
