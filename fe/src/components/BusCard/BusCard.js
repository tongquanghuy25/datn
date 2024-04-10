import React, { useState } from 'react';
import { Card, Button, Tabs } from 'antd';
// import 'antd/dist/antd.css';
import './style.css'; // Liên kết file CSS của bạn
import TabPane from 'antd/es/tabs/TabPane';
import TabSeatSelection from './TabContent/TabSeat/TabSeatSelection';

const BusCard = ({ bus }) => {

    const [showDetails, setShowDetails] = useState(false);
    const [activeTab, setActiveTab] = useState('1');

    const handleShowDetails = () => {
        setShowDetails(!showDetails);
    };

    const handleTabChange = key => {
        setActiveTab(key);
    };

    return (
        <div className="card-container">
            <Card className="card">
                <div className="card-content">
                    <div className="card-avatar">
                        <img src={bus.avatar} alt="Bus Avatar" />
                    </div>
                    <div className="card-info">
                        <h2>{bus.name}</h2>
                        <p>Số sao đánh giá: {bus.rating}</p>
                        <p className="price">Giá vé: {bus.price}</p>
                        <p>Số chỗ còn trống: {bus.availableSeats}</p>
                    </div>
                    <div>
                        <p>Giờ xuất phát: {bus.departureTime}</p>
                        <p>Địa điểm xuất phát: {bus.departureLocation}</p>
                        <p>Giờ đến: {bus.arrivalTime}</p>
                        <p>Địa điểm đến: {bus.arrivalLocation}</p></div>
                </div>
                <div className="card-actions">
                    <Button type="primary" onClick={handleShowDetails}>Xem chi tiết</Button>
                    <Button type="primary">Đặt vé</Button>
                </div>

                {showDetails && (
                    <Tabs activeKey={activeTab} onChange={handleTabChange}>
                        <TabPane tab="Đánh giá" key="1">
                            Nội dung đánh giá
                        </TabPane>
                        <TabPane tab="Chọn vé" key="2">
                            <TabSeatSelection></TabSeatSelection>
                        </TabPane>
                        <TabPane tab="Hành trình" key="3">
                            Nội dung hành trình
                        </TabPane>
                    </Tabs>
                )}
            </Card>
        </div>
    );
};

export default BusCard;
