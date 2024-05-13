import './style.css'
import { Button, Card, Col, DatePicker, Modal, Row, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import { useMutation, useQuery } from '@tanstack/react-query';
import { errorMes, successMes } from '../../Message/Message';
import { getTripRunningByDriver, getTripsByDriver, updateFinishTrip, updateTrip } from '../../../services/TripService';
import { useSelector } from 'react-redux';
import ModalTripDeitail from '../ListMyTripComponent/ModalTripDeitail';
import Meta from 'antd/es/card/Meta';
import TabPane from 'antd/es/tabs/TabPane';
import SeatInformation from './TabsContent/SeatInformation';
import PickUpDropOffInformation from './TabsContent/PickUpDropOffInformation';
import nodata from '../../../acess/nodata.jpg'
import GoodsInformation from './TabsContent/GoodsInformation';



const RunningTripComponent = () => {

    const user = useSelector((state) => state.user);
    const [trip, setTrip] = useState()
    const [listTicketOrder, setListTicketOrder] = useState([])
    const [listGoodsOrder, setListGoodsOrder] = useState([])
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
            console.log('data', data);
            setTrip(data?.data?.trip)
            setListTicketOrder(data?.data.listTicketOrder)
            setListGoodsOrder(data?.data.listGoodsOrder)

            //Get seat
            const listSeat = []
            data?.data?.listTicketOrder?.forEach(item => {
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

    const handleUpdateStatusSeat = (orderId, status) => {

        const newListSeat = listSeat?.map(item => {
            if (item.orderId == orderId) {
                return { ...item, status: status }
            }
            else return item
        })
        setListSeat(newListSeat)
    }

    const handleUpdateStatusGoods = (orderId, status) => {


        const newListGoods = listGoodsOrder?.map(item => {
            if (item._id == orderId) {
                return { ...item, status: status }
            }
            else return item
        })
        setListGoodsOrder(newListGoods)
    }

    const [visible, setVisible] = useState(false);

    const getTicketOrderDetail = (orderId) => {
        setTicketOrderDetail(listTicketOrder.find(item => item._id === orderId))
    }

    //Finish trip
    const mutation = useMutation({
        mutationFn: async (data) => {
            const { id, token, ...rest } = data;
            return await updateFinishTrip(id, token);
        },
        onSuccess: (data) => {
            successMes(data?.message)
            setTrip()
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    });

    const handleFinishTrip = () => {
        mutation.mutate({ id: trip?._id, token: user?.access_token, })
    }


    return (

        <div>
            {trip ?
                <div style={{ padding: '0 20px', maxHeight: '100vh' }}>
                    <Row justify={'center'} style={{ marginTop: '20px', marginBottom: '20px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '24px' }}>{trip?.routeId.placeStart}, {trip?.routeId.districtStart}  - {trip?.routeId.placeEnd}, {trip?.routeId.districtEnd}</div>
                    </Row>
                    <Row >
                        <Col span={5}>
                            <div><strong>Ngày xuất phát:  </strong>{trip?.departureDate}</div>
                            <div><strong>Giờ xuất phát:  </strong>{trip?.departureTime}</div>
                            <div><strong>Giá vé:  </strong>{trip?.ticketPrice}</div>
                        </Col>
                        <Col span={5}>
                            <div><strong>Loại xe:  </strong>{trip?.busId.typeBus}</div>
                            <div><strong>Biển số xe:  </strong>{trip?.busId.licensePlate}</div>
                            <div><strong></strong></div>
                        </Col>
                        <Col span={5}>
                            <div><strong>Số chỗ trống:  </strong>{trip?.availableSeats}</div>
                            <div><strong>Số chỗ đã đặt:  </strong>{trip?.ticketsSold}</div>
                            <div><strong>Số chỗ chưa thanh toán:  </strong></div>
                        </Col>
                        <Col span={5}>
                            <div><strong>Tổng số tiền vé phải thu:  </strong></div>
                            <div><strong>Tổng số tiền hàng:</strong></div>
                            <div><strong>Tổng số tiền :</strong></div>
                        </Col>
                        <Col span={4}>
                            <Button onClick={handleFinishTrip} type='primary' danger>Kết thúc chuyến</Button>
                        </Col>
                    </Row>
                    <Row >
                        <Tabs activeKey={activeTab} onChange={handleTabChange} style={{ width: '100%' }} >
                            <TabPane tab="Thông tin ghế" key="1">
                                <SeatInformation setVisible={setVisible} getTicketOrderDetail={getTicketOrderDetail} listSeat={listSeat}></SeatInformation>
                            </TabPane>
                            <TabPane tab="Thông tin hàng hóa" key="2">
                                <GoodsInformation listGoodsOrder={listGoodsOrder}></GoodsInformation>
                            </TabPane>
                            <TabPane tab="Thông tin đón/trả" key="3">
                                <PickUpDropOffInformation handleUpdateStatusGoods={handleUpdateStatusGoods} listGoodsOrder={listGoodsOrder} listTicketOrder={listTicketOrder} handleUpdateStatusSeat={handleUpdateStatusSeat} departureTime={trip?.departureTime} routeId={trip?.routeId._id}></PickUpDropOffInformation>
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
                :
                <div style={{ height: '100vh', fontSize: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={nodata} style={{ maxWidth: '400px' }}></img>
                    <h2>Chưa có chuyến xe nào đang chạy</h2>
                </div>
            }
        </div>
    )

}

export default RunningTripComponent