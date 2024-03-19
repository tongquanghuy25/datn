import { Col, Row } from 'antd'
import React from 'react'
import {
    PhoneOutlined,
    MailOutlined,
    EnvironmentOutlined,
    FacebookOutlined,
    YoutubeOutlined,
    InstagramOutlined,
    TikTokOutlined
} from '@ant-design/icons';

const FooterComponent = () => {
    return (
        // <div>FooterComponent</div>
        <div style={{ bottom: '0px', width: '100%', display: 'flex', background: '#9255FD', alignItems: 'center', flexDirection: 'column' }}>
            <Row>
                <Col style={{ width: '400px', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                    <div style={{ color: 'white', fontSize: '20px', fontWeight: '700', margin: '20px 10px' }}>Thông tin liên hệ</div>
                    <div style={{ color: 'white', fontSize: '16px', fontWeight: '400', marginTop: '10px' }}><EnvironmentOutlined style={{ marginRight: '10px' }} />Địa chỉ: Tòa B1 Đại học Bách khoa Hà Nội</div>
                    <div style={{ color: 'white', fontSize: '16px', fontWeight: '400', marginTop: '10px' }}><PhoneOutlined style={{ marginRight: '10px' }} />Số điện thoại: 0123456789</div>
                    <div style={{ color: 'white', fontSize: '16px', fontWeight: '400', marginTop: '10px' }}><MailOutlined style={{ marginRight: '10px' }} />Email: tongquanghuy25@gmail.com</div>
                </Col>
                <Col style={{ width: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <div style={{ color: 'white', fontSize: '20px', fontWeight: '700', margin: '20px 10px' }}>Mạng xã hội</div>
                    <div style={{ color: 'white', fontSize: '16px', marginTop: '10px' }}><FacebookOutlined style={{ marginRight: '10px', fontSize: '20px' }} />FaceBook</div>
                    <div style={{ color: 'white', fontSize: '16px', marginTop: '10px' }}><YoutubeOutlined style={{ marginRight: '10px', fontSize: '20px' }} />Youtube</div>
                    <div style={{ color: 'white', fontSize: '16px', marginTop: '10px' }}><InstagramOutlined style={{ marginRight: '10px', fontSize: '20px' }} />Instagram</div>
                    <div style={{ color: 'white', fontSize: '16px', marginTop: '10px' }}><TikTokOutlined style={{ marginRight: '10px', fontSize: '20px' }} />TikTok</div>
                </Col>

            </Row>
            <Row>
                <div style={{ color: 'white', fontSize: '16px', fontWeight: '400', marginTop: '20px' }}>Ant Design ©2024 Created by Ant UED</div>
            </Row>
        </div>
    )
}

export default FooterComponent