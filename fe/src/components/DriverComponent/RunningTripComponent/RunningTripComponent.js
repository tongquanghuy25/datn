import './style.css'
import { Button, Card, Col, DatePicker, Modal, Row, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import { useMutation, useQuery } from '@tanstack/react-query';
import { errorMes, successMes } from '../../Message/Message';
import { getTripRunningByDriver, getTripsByDriver, updateTrip } from '../../../services/TripService';
import { useSelector } from 'react-redux';
import ModalTripDeitail from '../ListMyTripComponent/ModalTripDeitail';
import Meta from 'antd/es/card/Meta';
import TabPane from 'antd/es/tabs/TabPane';
import SeatInformation from './TabsContent/SeatInformation';
import PickUpDropOffInformation from './TabsContent/PickUpDropOffInformation';


const RunningTripComponent = () => {

    const user = useSelector((state) => state.user);
    const [trip, setTrip] = useState()
    const [listOrder, setListOrder] = useState([])
    const [activeTab, setActiveTab] = useState('1');
    const [listSeat, setListSeat] = useState([])
    const [ticketOrderDetail, setTicketOrderDetail] = useState()



    const { data, isSuccess, isError, refetch } = useQuery(
        {
            queryKey: ['tripRunnig'],
            queryFn: () => getTripRunningByDriver(JSON.parse(localStorage.getItem('driver_id')), user?.access_token),
        });

    useEffect(() => {
        if (isSuccess) {
            console.log(data);
            setTrip(data?.data.trip)
            setListOrder(data?.data.listOrder)
            const listSeat = []
            data?.data?.listOrder?.forEach(item => {
                item.seats?.forEach(element => {
                    const seat = {
                        id: element,
                        orderId: item._id,
                        phone: item.phone,
                        ticketPrice: item.ticketPrice,
                        seatCount: item.seatCount,
                        isPaid: item.isPaid,
                        pickUp: item.pickUp,
                        dropOff: item.dropOff,
                        notePickUp: item.notePickUp,
                        noteDropOff: item.noteDropOff,
                        status: item.status
                    }
                    listSeat.push(seat)
                });
            })
            setListSeat(listSeat?.sort((a, b) => a.id - b.id))
        } else if (isError) {
        }
    }, [isSuccess, isError, data])

    const handleTabChange = key => {
        setActiveTab(key);
    };

    const handleUpdateStatusSeat = (orderId) => {

        const newListSeat = listSeat?.map(item => {
            if (item.orderId == orderId) {
                return { ...item, status: 'Đã lên xe' }
            }
            else return item
        })
        setListSeat(newListSeat)
    }

    const [visible, setVisible] = useState(false);

    const getTicketOrderDetail = (orderId) => {
        setTicketOrderDetail(listOrder.find(item => item._id === orderId))
    }
    console.log(ticketOrderDetail);
    return (
        <div style={{ padding: '0 20px', maxHeight: '100vh' }}>
            <Row justify={'center'} style={{ marginTop: '20px', marginBottom: '20px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '24px' }}>{trip?.routeId.placeStart}, {trip?.routeId.districtStart}  - {trip?.routeId.placeEnd}, {trip?.routeId.districtEnd}</div>
            </Row>
            <Row >
                <Col span={6}>
                    <div><strong>Ngày xuất phát:  </strong>{trip?.departureDate}</div>
                    <div><strong>Giờ xuất phát:  </strong>{trip?.departureTime}</div>
                    <div><strong>Giá vé:  </strong>{trip?.ticketPrice}</div>
                </Col>
                <Col span={6}>
                    <div><strong>Loại xe:  </strong>{trip?.busId.typeBus}</div>
                    <div><strong>Biển số xe:  </strong>{trip?.busId.licensePlate}</div>
                    <div><strong></strong></div>
                </Col>
                <Col span={6}>
                    <div><strong>Số chỗ trống:  </strong>{trip?.availableSeats}</div>
                    <div><strong>Số chỗ đã đặt:  </strong>{trip?.ticketsSold}</div>
                    <div><strong>Số chỗ chưa thanh toán:  </strong></div>
                </Col>
                <Col span={6}>
                    <div><strong>Tổng số tiền vé phải thu:  </strong></div>
                    <div><strong>Tổng số tiền hàng:</strong></div>
                    <div><strong>Tổng số tiền :</strong></div>
                </Col>
            </Row>
            <Row >
                <Tabs activeKey={activeTab} onChange={handleTabChange} style={{ width: '100%' }} >
                    <TabPane tab="Thông tin ghế" key="1">
                        <SeatInformation setVisible={setVisible} getTicketOrderDetail={getTicketOrderDetail} listSeat={listSeat}></SeatInformation>
                    </TabPane>
                    <TabPane tab="Thông tin hàng hóa" key="2">
                    </TabPane>
                    <TabPane tab="Thông tin đón/trả" key="3">
                        <PickUpDropOffInformation listOrder={listOrder} handleUpdateStatusSeat={handleUpdateStatusSeat} departureTime={trip?.departureTime} routeId={trip?.routeId._id}></PickUpDropOffInformation>
                    </TabPane>
                </Tabs>
            </Row>
            <Modal
                title={<div style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>Chi tiết vé</div>}
                open={visible}
                footer={null}
                width={600}

                onCancel={() => {
                    setVisible(false)
                }}

            >
                {/* <p><strong>Người Đặt:</strong> {trip.userOrder}</p> */}
                <div style={{ fontSize: '16px' }}>

                    <Row style={{ fontSize: '16px', margin: '20px 0 10px 0' }}>
                        <div><strong>Email:</strong> {ticketOrderDetail?.email}</div>
                        <div style={{ marginLeft: '30px' }}><strong>Điện Thoại:</strong> {ticketOrderDetail?.phone}</div>
                    </Row>
                    <div ><strong>Ngày Khởi Hành:</strong> {ticketOrderDetail?.departureDate}</div>

                    <Row style={{ margin: '10px 0' }} >
                        <Col span={12} style={{ fontSize: '16px' }}>
                            <div><strong>Nơi Đón:</strong> {ticketOrderDetail?.pickUp}</div>
                            <div><strong>Thời Gian Đón:</strong> {ticketOrderDetail?.timePickUp}</div>
                            <div><strong>Ngày Đón:</strong> {ticketOrderDetail?.datePickUp}</div>
                            <div><strong>Ghi Chú Nơi Đón:</strong> {ticketOrderDetail?.notePickUp}</div>
                        </Col>
                        <Col span={12} style={{ fontSize: '16px' }}>
                            <div><strong>Nơi Trả:</strong> {ticketOrderDetail?.dropOff}</div>
                            <div><strong>Thời Gian Trả:</strong> {ticketOrderDetail?.timeDropOff}</div>
                            <div><strong>Ngày Trả:</strong> {ticketOrderDetail?.dateDropOff}</div>
                            <div><strong>Ghi Chú Nơi Trả:</strong> {ticketOrderDetail?.noteDropOff}</div>
                        </Col>
                    </Row>



                    <div><strong>Số Lượng Ghế:</strong> {ticketOrderDetail?.seatCount}</div>
                    <div style={{ marginBottom: '10px' }}><strong>Ghế Đặt:</strong> {ticketOrderDetail?.seats.toString()}</div>

                    <div><strong>Giá Vé:</strong> {ticketOrderDetail?.ticketPrice}</div>
                    <div><strong>Phụ Phí:</strong> {ticketOrderDetail?.extraCosts}</div>
                    <div><strong>Giảm Giá:</strong> {ticketOrderDetail?.discount}</div>
                    <div style={{ marginBottom: '10px' }}><strong>Tổng Tiền:</strong> {ticketOrderDetail?.totalPrice}</div>

                    <div><strong>Phương Thức Thanh Toán:</strong> {ticketOrderDetail?.paymentMethod}</div>
                    <div><strong>Thanh Toán:</strong> {ticketOrderDetail?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
                    <div><strong>Trạng Thái:</strong> {ticketOrderDetail?.status}</div>
                </div>
            </Modal>
        </div>
    )
}

export default RunningTripComponent