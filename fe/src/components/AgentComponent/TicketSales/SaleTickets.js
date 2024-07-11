import React, { useState } from 'react'
import SearchBusComponent from '../../SearchBusComponent/SearchBusComponent'
import { useMutation } from '@tanstack/react-query'
import { getTripsBySearch } from '../../../services/TripService'
import { errorMes } from '../../Message/Message';
import { Button, Card, Col, Divider, List, Row, Tag } from 'antd';
import ModalOrderTicket from './ModalOrderTicket';
import { formatTimeVn } from '../../../utils';
import nodata from '../../../acess/nodata.jpg'

const SaleTickets = () => {
    const [dataSearch, setDataSearch] = useState()
    const [isSearch, setIsSearch] = useState(false)
    const [isOrdering, setIsOrdering] = useState(false)
    const [listTrip, setListTrip] = useState([])
    const [trip, setTrip] = useState()
    const [page, setPage] = useState(1)



    const mutationGetList = useMutation({
        mutationFn: async (data) => {
            return await getTripsBySearch(data);
        },
        onSuccess: (data) => {
            setListTrip(data?.data)
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    });


    const handleSearch = (data) => {
        setPage(1);
        mutationGetList.mutate({ ...data, page: 1, pageSize: parseInt(process.env.REACT_APP_PAGE_SIZE) })
        // mutationGetInforFilter.mutate(data)
        setDataSearch(data)
        setIsSearch(true)
    }

    const loadMoreTrips = () => {
        const nextPage = page + 1;
        mutationGetList.mutate({ ...dataSearch, page: nextPage, pageSize: parseInt(process.env.REACT_APP_PAGE_SIZE) });
        setPage(nextPage);
    };

    const handleOrderTicket = (trip) => {
        setTrip(trip)
        setIsOrdering(true)
    }

    return (
        <div>
            <SearchBusComponent handleSearch={handleSearch}></SearchBusComponent>
            {
                listTrip?.length > 0 ? <>
                    <Row style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                        {
                            listTrip.map(trip => (
                                <Card style={{ width: '80%', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', marginBottom: 20, backgroundColor: '#faf3de' }}>
                                    <Row>
                                        <Col offset={5} style={{ fontSize: 24, fontWeight: 'bold', marginBottom: '10px', color: '#1890ff' }}>{trip?.busOwner.busOwnerName}</Col>
                                    </Row>
                                    <Row style={{ display: 'flex', alignItems: 'center' }} >
                                        <Col span={5} style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: '40px', color: '#1890ff', textAlign: 'center' }}>{formatTimeVn(trip.departureTime)}</Col>
                                        <Col span={6} style={{ alignSelf: 'flex-start', fontSize: '16px', color: '#666', textAlign: 'left' }}>
                                            <div><strong>Số Điện Thoại:</strong> {trip?.busOwner.user.phone}</div>
                                            <div><strong>Loại xe:</strong> {trip.bus.typeBus} chỗ</div>
                                            <div><strong>Số ghế trống:</strong> {trip.totalSeats - trip.bookedSeats}</div>
                                            <div><strong>Trạng thái: </strong>
                                                <Tag
                                                    color={trip.status === 'NotStarted' ? 'error' : (trip.status === 'Ended' ? 'success' : 'warning')}
                                                >
                                                    {trip.status === 'NotStarted' ? 'Chưa khởi hành' : (trip.status === 'Started' ? 'Đã khởi hành' : 'Đã kết thúc')}
                                                </Tag>
                                            </div>
                                        </Col>
                                        <Col span={9} style={{ alignSelf: 'flex-start', fontSize: '16px', color: '#666', textAlign: 'left' }}>
                                            <div><strong>Điểm xuất phát:</strong> {trip.route.placeStart} - {trip.route.districtStart}</div>
                                            <div><strong>Thời gian di chuyển:</strong> {trip.route.journeyTime && formatTimeVn(trip.route.journeyTime)}</div>
                                            <div><strong>Điểm đến:</strong> {trip.route.placeEnd} - {trip.route.districtEnd}</div>
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
                    {listTrip.length % parseInt(process.env.REACT_APP_PAGE_SIZE) === 0 && (
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <Button onClick={loadMoreTrips}>Xem thêm</Button>
                        </div>
                    )}
                </>
                    :
                    <Col align="middle" style={{}}>
                        <img src={nodata} style={{ maxWidth: '400px' }}></img>
                        <h2>Chưa có chuyến xe nào phù hợp</h2>
                    </Col>
            }

            {isOrdering && <ModalOrderTicket trip={trip} isOrdering={isOrdering} setIsOrdering={setIsOrdering}></ModalOrderTicket>}
        </div >
    )
}

export default SaleTickets