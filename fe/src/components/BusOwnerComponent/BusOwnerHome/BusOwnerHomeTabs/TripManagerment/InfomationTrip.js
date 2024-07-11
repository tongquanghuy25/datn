import { Card, Col, Divider, Modal, Row, Tabs, Tag } from 'antd'
import TabPane from 'antd/es/tabs/TabPane';
import React, { useState } from 'react'
import { getVnCurrency } from '../../../../../utils';

const InfomationTrip = ({ tripSelected, setTripSelected }) => {

    const {
        totalSeats,
        bus,
        departureDate,
        departureTime,
        paymentRequire,
        prebooking,
        route,
        status,
        ticketPrice,
        bookedSeats
    } = tripSelected;

    console.log(tripSelected);

    return (
        <div>
            <Modal
                open={tripSelected ? true : false}
                okText='Xác nhận'
                onOk={() => {
                }}
                cancelText='Hủy'
                onCancel={() => setTripSelected()}
                width={'70%'}
                height={'90%'}
                style={{
                    top: 10,
                }}
            >
                <Row>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Row>
                                <Col span={24}>
                                    <h3>Thông tin chuyến đi</h3>
                                    <Divider />
                                </Col>
                                <Col span={12}>
                                    {/* <p><strong>Ngày khởi hành:</strong> {dayjs(departureDate).format('DD/MM/YYYY')}</p> */}
                                    <p><strong>Giờ khởi hành:</strong> {departureTime}</p>
                                    <p><strong>Địa điểm xuất phát:</strong> {route.provinceStart}, {route.districtStart}, {route.placeStart}</p>
                                    <p><strong>Địa điểm đến:</strong> {route.provinceEnd}, {route.districtEnd}, {route.placeEnd}</p>
                                </Col>
                                <Col span={12}>
                                    {/* NotStarted', 'Started', 'Ended', 'Cancelled */}
                                    <p><strong>Trạng thái:</strong> <Tag>
                                        {status === 'NotStarted' ? 'Chưa khởi hành'
                                            : status === 'Started' ? 'Đã khởi hành'
                                                : status === 'Ended' ? 'Đã kết thúc'
                                                    : 'Đã hủy'
                                        }</Tag></p>
                                    <p><strong>Số ghế trống:</strong> {totalSeats - bookedSeats}</p>
                                    <p><strong>Giá vé:</strong> {getVnCurrency(ticketPrice)}</p>
                                    <p><strong>Số ghế đã đặt:</strong> {bookedSeats}</p>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={24}>
                            <Row>
                                <Col span={24}>
                                    <h3>Thông tin xe</h3>
                                    <Divider />
                                </Col>
                                <Col span={12}>
                                    <p><strong>Biển số xe:</strong> {bus.licensePlate}</p>
                                    <p><strong>Loại xe:</strong> {bus.typeBus}</p>
                                    <p><strong>Màu sắc:</strong> {bus.color}</p>
                                </Col>
                                <Col span={12}>
                                    <p><strong>Số ghế:</strong> {bus.numberSeat}</p>
                                    <p><strong>Loại ghế :</strong> {bus.typeSeat == 'Sitting' ? 'Ghế ngồi' : (
                                        bus.typeSeat == 'Sleeper' ? 'Ghế nằm'
                                            : bus.typeSeat == 'Sleeper' ? 'Ghế massage'
                                                : 'Ghế thương gia'
                                    )}</p>
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
            </Modal>
        </div>
    )
}

export default InfomationTrip