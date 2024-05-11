import React, { useState } from 'react';
import { Card, Button, Tabs, Rate } from 'antd';
// import 'antd/dist/antd.css';
import './style.css'; // Liên kết file CSS của bạn
import TabPane from 'antd/es/tabs/TabPane';
import TabBookTicket from './TabContent/TabBookTicket/TabBookTicket';
import TabImagesComponent from './TabContent/TabImages/TabImagesComponent';
import TabJourneysComponent from './TabContent/TabJourneys/TabJourneysComponent';

const BusCard = ({ trip }) => {

    const [showDetails, setShowDetails] = useState(false);
    const [bookTickets, setBookTickets] = useState(false);
    const [activeTab, setActiveTab] = useState('1');


    // const listTicketSold = ['A1', 'A2', 'A3', 'B1']
    const handleShowDetails = () => {
        setBookTickets(false)
        setShowDetails(!showDetails);
    };
    const handleBookTickets = () => {
        setShowDetails(false)
        setBookTickets(!bookTickets);
    };

    const handleTabChange = key => {
        setActiveTab(key);
    };


    return (
        <div className="card-trip-container">
            <Card className="card-trip">
                <div className="card-trip-content">
                    <div className="card-trip-avatar">
                        <img src={trip.avatar} alt="Bus Avatar" />
                    </div>
                    <div className="card-trip-info">
                        <p className='name'>{trip.busOwnerName}</p>
                        <p>Đánh giá: {trip.rating} <Rate disabled defaultValue={1} count={1} /> ({trip.rating})</p>
                        <p className="price">Giá vé: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(trip.ticketPrice)}</p>
                        <p>Số chỗ còn trống: {trip.availableSeats}</p>
                    </div>
                    <div>
                        <p>Giờ xuất phát: {trip.departureTime}</p>
                        <p>Địa điểm xuất phát: {trip.departureLocation}</p>
                        <p>Giờ đến: {trip.arrivalTime}</p>
                        <p>Địa điểm đến: {trip.arrivalLocation}</p></div>
                </div>
                <div className="card-trip-actions">
                    <Button type="primary" onClick={handleShowDetails}>Xem chi tiết</Button>
                    <Button type="primary" onClick={handleBookTickets}>Đặt vé</Button>
                </div>

                {showDetails && (
                    <Tabs activeKey={activeTab} onChange={handleTabChange}>
                        <TabPane tab="Hình ảnh" key="1">
                            <TabImagesComponent images={trip.images}></TabImagesComponent>
                        </TabPane>
                        <TabPane tab="Đánh giá" key="2">
                            Nội dung đánh giá
                        </TabPane>
                        <TabPane tab="Tiện ích" key="3">
                            Nội dung Tiện ích
                        </TabPane>
                        <TabPane tab="Hành trình" key="4">
                            <TabJourneysComponent departureTime={trip.departureTime} routeId={trip.routeId}></TabJourneysComponent>
                        </TabPane>
                        <TabPane tab="Chính sách" key="5">
                            Nội dung hành trình
                        </TabPane>
                    </Tabs>
                )}
                {bookTickets && (

                    <TabBookTicket
                        typeBus={trip.typeBus}
                        paymentRequire={trip.paymentRequire}
                        prebooking={trip.prebooking}
                        routeId={trip.routeId}
                        ticketPrice={trip.ticketPrice}
                        departureTime={trip.departureTime}
                        tripId={trip._id}
                        departureDate={trip.departureDate}
                        busOwnerName={trip.busOwnerName}
                        routeName={`${trip.departureLocation} - ${trip.arrivalLocation}`}
                    />

                )}

            </Card>
        </div>
    );
};

export default BusCard;
