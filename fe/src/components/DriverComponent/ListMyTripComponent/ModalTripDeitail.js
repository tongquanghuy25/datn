import { Card, Col, Divider, Modal, Row, Tabs, Tag } from 'antd'
import TabPane from 'antd/es/tabs/TabPane';
import React, { useState } from 'react'

const ModalTripDeitail = ({ tripSelected, setTripSelected }) => {

    const [activeTab, setActiveTab] = useState('1');

    const handleTabChange = key => {
        setActiveTab(key);
    };

    const {
        availableSeats,
        busId,
        departureDate,
        departureTime,
        paymentRequire,
        prebooking,
        routeId,
        status,
        ticketPrice,
        ticketsSold
    } = tripSelected;



    const totalSeats = 20;
    const bookedSeats = [
        { seatNumber: 3, name: 'John Doe', phone: '123-456-7890', email: 'john@example.com', pickup: '123 Main St', time: '9:00 AM' },
        { seatNumber: 7, name: 'Jane Smith', phone: '987-654-3210', email: 'jane@example.com', pickup: '456 Elm St', time: '10:00 AM' }
    ];
    const seatStatus = Array(totalSeats).fill(false);
    bookedSeats.forEach(seat => {
        seatStatus[seat.seatNumber - 1] = seat;
    });

    return (
        <div>
            <Modal
                // title={<h2>Thông tin chi tiết</h2>}
                open={tripSelected ? true : false}
                okText='Xác nhận'
                onOk={() => {
                }}
                cancelText='Hủy'
                onCancel={() => setTripSelected()}
                width={'100%'}
                height={'90%'}
                style={{
                    top: 10,
                }}
            >
                <Tabs activeKey={activeTab} onChange={handleTabChange}>
                    <TabPane tab="Thông tin chuyến" key="1">
                        <Row>
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Row>
                                        <Col span={24}>
                                            <h3>Thông tin chuyến đi</h3>
                                            <Divider />
                                        </Col>
                                        <Col span={12}>
                                            {/* <p><strong>Ngày khởi hành:</strong> {dayjs(departureDate).format('DD/MM/YYYY')}</p> */}
                                            <p><strong>Giờ khởi hành:</strong> {departureTime}</p>
                                            <p><strong>Địa điểm xuất phát:</strong> {routeId.provinceStart}, {routeId.districtStart}, {routeId.placeStart}</p>
                                            <p><strong>Địa điểm đến:</strong> {routeId.provinceEnd}, {routeId.districtEnd}, {routeId.placeEnd}</p>
                                        </Col>
                                        <Col span={12}>
                                            <p><strong>Trạng thái:</strong> <Tag color={status === 'active' ? 'green' : 'red'}>{status}</Tag></p>
                                            <p><strong>Số ghế trống:</strong> {availableSeats}</p>
                                            <p><strong>Giá vé:</strong> {ticketPrice}</p>
                                            <p><strong>Vé đã bán:</strong> {ticketsSold}</p>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <Row>
                                        <Col span={24}>
                                            <h3>Thông tin xe buýt</h3>
                                            <Divider />
                                        </Col>
                                        <Col span={12}>
                                            <p><strong>Biển số xe:</strong> {busId.licensePlate}</p>
                                            <p><strong>Loại xe:</strong> {busId.typeBus}</p>
                                            <p><strong>Màu sắc:</strong> {busId.color}</p>
                                        </Col>
                                        <Col span={12}>
                                            <p><strong>Số ghế:</strong> {busId.numberSeat}</p>
                                            <p><strong>Yên nằm:</strong> {busId.isRecliningSeat ? 'Có' : 'Không'}</p>
                                            <p><strong>Trang bị:</strong> {busId.convinients.join(', ')}</p>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <h3>Thông tin thanh toán và đặt chỗ</h3>
                                    <Divider />
                                    <p><strong>Yêu cầu thanh toán:</strong> {paymentRequire ? 'Có' : 'Không'}</p>
                                    <p><strong>Đặt chỗ trước:</strong> {prebooking ? 'Có' : 'Không'}</p>
                                </Col>
                            </Row>
                        </Row>
                    </TabPane>
                    <TabPane tab="Thông tin ghế" key="2">
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                            {seatStatus.map((seat, index) => (
                                <div
                                    key={index}
                                    style={{
                                        borderRadius: 20,
                                        flex: '0 0 calc(25% - 16px)',
                                        height: '240px',
                                        backgroundColor: seat ? '#ff4d4f' : '#d3d3d3',
                                        color: seat ? 'white' : 'black'
                                    }}
                                >
                                    <div style={{ marginLeft: '20px', fontSize: '24px', fontWeight: 'bold' }}>{index}</div>
                                    <div>
                                        {seat && (
                                            <>
                                                <div>{seat.name}</div>
                                                <div>Phone: {seat.phone}</div>
                                                <div>Email: {seat.email}</div>
                                                <div>Pickup: {seat.pickup}</div>
                                                <div>Time: {seat.time}</div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabPane>

                </Tabs>



            </Modal>
        </div >
    )
}

export default ModalTripDeitail

