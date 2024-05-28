import React, { useState } from 'react'
import SearchBusComponent from '../../SearchBusComponent/SearchBusComponent'
import { useMutation } from '@tanstack/react-query'
import { getTripsBySearch } from '../../../services/TripService'
import { errorMes } from '../../Message/Message';
import { Button, Card, Col, Divider, List, Row, Tag } from 'antd';
import ModalOrderTicket from './ModalOrderTicket';



function calculateArrivalTime(startTime, duration) {
    // Chuyển đổi chuỗi 'hh:mm' thành giờ và phút
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [durationHour, durationMinute] = duration.split(':').map(Number);

    // Tính toán thời gian đến
    let arrivalHour = startHour + durationHour;
    let arrivalMinute = startMinute + durationMinute;

    // Xử lý trường hợp khi phút vượt quá 60
    if (arrivalMinute >= 60) {
        arrivalHour += Math.floor(arrivalMinute / 60);
        arrivalMinute %= 60;
    }

    if (arrivalMinute > 24) {
        arrivalMinute = arrivalMinute % 24
    }

    // Định dạng thời gian đến
    const formattedArrivalMinute = arrivalMinute.toString().padStart(2, '0'); // Thêm số 0 phía trước nếu cần
    const arrivalTime = `${arrivalHour} giờ ${formattedArrivalMinute}`;

    // Định dạng thời gian xuất phát
    const formattedStartMinute = startMinute.toString().padStart(2, '0'); // Thêm số 0 phía trước nếu cần
    const departureTime = `${startHour} giờ ${formattedStartMinute}`;

    return { departureTime, arrivalTime };
}

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
            //         _id: trip._id,
            //         busOwnerName: trip.busOwnerId.busOwnerName,
            //         avatar: trip.busId.avatar,
            //         rating: trip.busId.averageRating,
            //         reviewCount: trip.busId.reviewCount,
            //         images: trip.busId.images,
            //         convinients: trip.busId.convinients,
            //         typeBus: trip.busId.typeBus,
            //         availableSeats: `${trip.busId.numberSeat - trip.ticketsSold}/${trip.busId.numberSeat}`,
            //         routeId: trip.routeId._id,
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

    return (
        <div>
            <SearchBusComponent handleSearch={handleSearch}></SearchBusComponent>
            <Row style={{ display: 'flex', justifyContent: 'center' }}>
                {
                    listTrip.map(trip => (
                        <Card style={{ width: '80%', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', marginBottom: 20, backgroundColor: '#faf3de' }}>
                            <Row>
                                <Col offset={4} style={{ fontSize: 24, fontWeight: 'bold', marginBottom: '10px', color: '#1890ff' }}>{trip.busOwnerId.busOwnerName}</Col>
                            </Row>
                            <Row style={{ display: 'flex', alignItems: 'center' }} >
                                <Col span={4} style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: '40px', color: '#1890ff', textAlign: 'center' }}>{trip.departureTime}</Col>
                                <Col span={6} style={{ alignSelf: 'flex-start', fontSize: '16px', color: '#666', textAlign: 'left' }}>
                                    <div><strong>Số Điện Thoại:</strong> {trip.busOwnerId.userId.phone}</div>
                                    <div><strong>Loại xe:</strong> {trip.busId.typeBus} chỗ</div>
                                    <div><strong>Số ghế trống:</strong> {trip.availableSeats}</div>
                                    <div><strong>Trạng thái: </strong>
                                        <Tag
                                            color={trip.status === 'Chưa khởi hành' ? 'error' : (trip.status === 'Đã kết thúc' ? 'success' : 'warning')}
                                        >
                                            {trip.status}
                                        </Tag>
                                    </div>
                                </Col>
                                <Col span={10} style={{ alignSelf: 'flex-start', fontSize: '16px', color: '#666', textAlign: 'left' }}>
                                    <div><strong>Điểm xuất phát:</strong> {trip.routeId.placeStart} - {trip.routeId.districtStart}</div>
                                    <div><strong>Thời gian di chuyển:</strong> {trip.routeId.journeyTime}</div>
                                    <div><strong>Điểm đến:</strong> {trip.routeId.placeEnd} - {trip.routeId.districtEnd}</div>
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