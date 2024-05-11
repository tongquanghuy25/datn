import { Button, Card, Col, DatePicker, Modal, Row, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import { useMutation, useQuery } from '@tanstack/react-query';
import { errorMes, successMes } from '../../Message/Message';
import { getTripsByDriver, updateTrip } from '../../../services/TripService';
import { useSelector } from 'react-redux';
import ModalTripDeitail from './ModalTripDeitail';


const ListMyTripComponent = ({ setSelectedKeys }) => {
    const user = useSelector((state) => state.user)
    const [listTrip, setListTrip] = useState([])
    const [tripSelected, setTripSelected] = useState()
    const [day, setDay] = useState(dayjs().format('DD/MM/YYYY'))


    const { data, isSuccess, isError, refetch } = useQuery(
        {
            queryKey: ['tripsdriver', day],
            queryFn: () => getTripsByDriver(JSON.parse(localStorage.getItem('driver_id')), user?.access_token, day ? day : dayjs().format('DD/MM/YY')),
        });


    useEffect(() => {
        if (isSuccess) {
            console.log(data?.data);
            setListTrip(data?.data)
        } else if (isError) {
            errorMes()
        }

    }, [isSuccess, isError, data])

    const onChangeDate = (time, timeString) => {
        setDay(timeString)
    }

    const onClickDetail = (trip) => {
        setTripSelected(trip)
    }

    const mutationStartTrip = useMutation({
        mutationFn: async (data) => {
            const { id, token } = data;
            return await updateTrip(id, token, { status: 'Đã khởi hành', driverId: JSON.parse(localStorage.getItem('driver_id')) });
        },
        onSuccess: (data) => {
            successMes(data?.message)
            const index = listTrip.findIndex(item => item._id === data?.data._id)

            if (index !== -1) {
                const newListTrip = [...listTrip]
                newListTrip[index] = { ...listTrip[index], status: 'Đã khởi hành' }
                setListTrip(newListTrip)
            }
            setSelectedKeys('1')
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    });

    const handleStartTrip = (trip) => {
        mutationStartTrip.mutate({ id: trip._id, token: user?.access_token })
    }
    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: 24 }}>
            <Row>
                <div>
                    <DatePicker
                        format='DD/MM/YYYY'
                        style={{ marginBottom: 20 }}
                        placeholder='Chọn ngày'
                        defaultValue={dayjs()}
                        onChange={onChangeDate}
                        size='large'
                    />
                </div>
            </Row>
            <Row style={{ flex: 1, overflowY: 'auto' }}>
                {
                    listTrip.map(trip => (
                        <Card style={{ width: 'calc(100% - 32px)', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', marginBottom: 20 }}>
                            <Row style={{ display: 'flex', alignItems: 'center' }}>
                                <Col span={4} style={{ fontWeight: 'bold', fontSize: '40px', color: '#1890ff', textAlign: 'center' }}>{trip.departureTime}</Col>
                                <Col span={6} style={{ fontSize: '16px', color: '#666', textAlign: 'left' }}>
                                    <div><strong>Biển số xe:</strong> {trip.busId.licensePlate}</div>
                                    <div><strong>Loại xe:</strong> {trip.busId.typeBus} chỗ</div>
                                    <div><strong>Số ghế trống:</strong> {trip.availableSeats}</div>
                                    <div><strong>Số ghế đã đặt:</strong> {trip.bookedSeats}</div>
                                    <div><strong>Trạng thái: </strong>
                                        <Tag
                                            color={trip.status === 'Chưa khởi hành' ? 'error' : (trip.status === 'Đã kết thúc' ? 'success' : 'warning')}
                                        >
                                            {trip.status}
                                        </Tag>
                                    </div>
                                </Col>
                                <Col span={10} style={{ fontSize: '16px', color: '#666', textAlign: 'left' }}>
                                    <div><strong>Điểm xuất phát:</strong> {trip.routeId.placeStart} - {trip.routeId.districtStart}</div>
                                    <div><strong>Thời gian di chuyển:</strong> {trip.routeId.journeyTime}</div>
                                    <div><strong>Điểm đến:</strong> {trip.routeId.placeEnd} - {trip.routeId.districtEnd}</div>
                                </Col>
                                <Col span={4} style={{ fontSize: '16px', color: '#666' }}>
                                    <Button onClick={() => onClickDetail(trip)} style={{ marginBottom: '16px' }} >Chi tiết</Button>
                                    <Button onClick={() => handleStartTrip(trip)} type="primary" >Bắt đầu chuyến</Button>
                                </Col>
                            </Row>
                        </Card>
                    ))
                }
            </Row>
            {tripSelected && <ModalTripDeitail tripSelected={tripSelected} setTripSelected={setTripSelected} />}
        </div>
    )
}

export default ListMyTripComponent