import React from 'react';
import { Card, Col, List, Row } from 'antd';
import {
    WifiOutlined,
    DashboardOutlined,
    UsbOutlined,
    SmileOutlined,
    CoffeeOutlined,
    VideoCameraOutlined,
    RestOutlined,
    CarOutlined,
    BulbOutlined,
    ProfileOutlined
} from '@ant-design/icons';

const amenitiesData = [
    { icon: <WifiOutlined />, name: 'Wifi' },
    { icon: <DashboardOutlined />, name: 'Điều hòa' },
    { icon: <UsbOutlined />, name: 'Cổng sạc USB' },
    { icon: <SmileOutlined />, name: 'Khăn lạnh' },
    { icon: <CoffeeOutlined />, name: 'Nước uống' },
    { icon: <VideoCameraOutlined />, name: 'Màn hình TV' },
    { icon: <RestOutlined />, name: 'Nhà vệ sinh' },
    { icon: <CarOutlined />, name: 'Ghế massage' },
    { icon: <BulbOutlined />, name: 'Đèn Led đọc sách' },
    { icon: <ProfileOutlined />, name: 'Chăn gối' },
];


const TabConvinient = ({ convinients }) => {
    const convinientsArray = JSON.parse(convinients);
    console.log('convinients', convinients);
    const amenitiesNames = amenitiesData.map(item => item.name);
    const arrConvinient = convinientsArray.filter(item => !amenitiesNames.includes(item))
    const filteredAmenities = amenitiesData.filter(amenity => convinientsArray.includes(amenity.name));
    console.log('arrConvinient', arrConvinient);
    return (
        <div style={{ padding: '20px' }}>
            <Row gutter={[16, 16]}>
                {filteredAmenities.map((amenity, index) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={index}>
                        <Card
                            hoverable
                            style={{ textAlign: 'center', borderRadius: '10px', transition: 'transform 0.3s' }}
                            bodyStyle={{ padding: '20px' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ fontSize: '24px', marginBottom: '10px' }}>
                                {amenity.icon}
                            </div>
                            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{amenity.name}</div>
                        </Card>
                    </Col>
                ))}
            </Row>
            {arrConvinient?.length > 0 && <Row style={{ marginTop: 20 }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'green' }}> Các tiện ích khác:</div>

                <div style={{ marginLeft: 30 }}>
                    {arrConvinient.map(
                        item => {
                            return <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{item}</div>
                        }
                    )}
                </div>
            </Row>}
        </div>
    )
}

export default TabConvinient