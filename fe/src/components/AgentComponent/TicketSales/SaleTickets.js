import React, { useState } from 'react'
import SearchBusComponent from '../../SearchBusComponent/SearchBusComponent'
import { useMutation } from '@tanstack/react-query'
import { getTripsBySearch } from '../../../services/TripService'
import { errorMes } from '../../Message/Message';
import { Button, Card, Col, Divider, List, Row, Tag } from 'antd';
import ModalOrderTicket from './ModalOrderTicket';
import { formatTimeVn } from '../../../utils';

const SaleTickets = () => {
    const [dataSearch, setDataSearch] = useState()
    const [isSearch, setIsSearch] = useState(false)
    const [isOrdering, setIsOrdering] = useState(false)
    const [listTrip, setListTrip] = useState([])
    const [trip, setTrip] = useState()


    const mutationGetList = useMutation({
        mutationFn: async (data) => {
            return await getTripsBySearch(data);
        },
        onSuccess: (data) => {
            console.log('a', data?.data);
            // const listData = data.data?.map(trip => {
            //     const { departureTime, arrivalTime } = calculateArrivalTime(trip.departureTime, trip.routeId.journeyTime)
            //     return {
            //         id: trip.id,
            //         busOwnerName: trip.busOwnerId.busOwnerName,
            //         avatar: trip.busId.avatar,
            //         rating: trip.busId.averageRating,
            //         reviewCount: trip.busId.reviewCount,
            //         images: trip.busId.images,
            //         convinients: trip.busId.convinients,
            //         typeBus: trip.busId.typeBus,
            //         availableSeats: `${trip.busId.numberSeat - trip.ticketsSold}/${trip.busId.numberSeat}`,
            //         routeId: trip.routeId.id,
            //         departureLocation: `${trip.routeId.districtStart} - ${trip.routeId.placeStart}`,
            //         arrivalLocation: `${trip.routeId.districtEnd} - ${trip.routeId.placeEnd}`,
            //         ticketPrice: trip.ticketPrice,
            //         paymentRequire: trip.paymentRequire,
            //         prebooking: trip.prebooking,
            //         departureDate: trip.departureDate,
            //         arrivalTime: arrivalTime,
            //         departureTime: departureTime,
            //     }
            // })
            setListTrip(data?.data)
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    });


    const handleSearch = (data) => {
        mutationGetList.mutate(data)
        // mutationGetInforFilter.mutate(data)
        setDataSearch(data)
        setIsSearch(true)
    }

    const handleOrderTicket = (trip) => {
        setTrip(trip)
        setIsOrdering(true)
    }

    console.log('listtrip', listTrip);

    return (
        <div>
            <SearchBusComponent handleSearch={handleSearch}></SearchBusComponent>
            <Row style={{ display: 'flex', justifyContent: 'center' }}>
                {
                    listTrip.map(trip => (
                        <Card style={{ width: '80%', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', marginBottom: 20, backgroundColor: '#faf3de' }}>
                            <Row>
                                <Col offset={4} style={{ fontSize: 24, fontWeight: 'bold', marginBottom: '10px', color: '#1890ff' }}>{trip['busOwner.busOwnerName']}</Col>
                            </Row>
                            <Row style={{ display: 'flex', alignItems: 'center' }} >
                                <Col span={4} style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: '40px', color: '#1890ff', textAlign: 'center' }}>{formatTimeVn(trip.departureTime)}</Col>
                                <Col span={6} style={{ alignSelf: 'flex-start', fontSize: '16px', color: '#666', textAlign: 'left' }}>
                                    <div><strong>Số Điện Thoại:</strong> {trip['busOwner.user.phone']}</div>
                                    <div><strong>Loại xe:</strong> {trip['bus.typeBus']} chỗ</div>
                                    <div><strong>Số ghế trống:</strong> {trip.availableSeats}</div>
                                    <div><strong>Trạng thái: </strong>
                                        <Tag
                                            color={trip.status === 'NotStarted' ? 'error' : (trip.status === 'Ended' ? 'success' : 'warning')}
                                        >
                                            {trip.status === 'NotStarted' ? 'Chưa khởi hành' : (trip.status === 'Started' ? 'Đã khởi hành' : 'Đã kết thúc')}
                                        </Tag>
                                    </div>
                                </Col>
                                <Col span={10} style={{ alignSelf: 'flex-start', fontSize: '16px', color: '#666', textAlign: 'left' }}>
                                    <div><strong>Điểm xuất phát:</strong> {trip['route.placeStart']} - {trip['route.districtStart']}</div>
                                    <div><strong>Thời gian di chuyển:</strong> {formatTimeVn(trip['route.journeyTime'])}</div>
                                    <div><strong>Điểm đến:</strong> {trip['route.placeEnd']} - {trip['route.districtEnd']}</div>
                                </Col>
                                <Col span={4} style={{ alignSelf: 'flex-start', fontSize: '16px', color: '#666' }} >
                                    <div><strong>Giá vé:</strong> {trip.ticketPrice}</div>
                                    <Button onClick={() => { handleOrderTicket(trip) }} style={{ marginTop: '40px' }} type='primary'>Đặt vé</Button>
                                </Col>
                            </Row>
                        </Card>
                    ))
                }
            </Row>
            {isOrdering && <ModalOrderTicket trip={trip} isOrdering={isOrdering} setIsOrdering={setIsOrdering}></ModalOrderTicket>}
        </div >
    )
}

export default SaleTickets