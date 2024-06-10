import { Button, Card, Col, DatePicker, Modal, Row, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import { useMutation, useQuery } from '@tanstack/react-query';
import { errorMes, successMes } from '../../Message/Message';
import { getTripsByDriver, updateTrip } from '../../../services/TripService';
import { useSelector } from 'react-redux';
import ModalTripDeitail from './ModalTripDeitail';
import { formatTime } from '../../../utils';


const ListMyTripComponent = ({ setSelectedKeys }) => {
    const user = useSelector((state) => state.user)
    const [listTrip, setListTrip] = useState([])
    const [tripSelected, setTripSelected] = useState()
    const [day, setDay] = useState(dayjs().format('DD/MM/YYYY'))


    const { data, isSuccess, isError, refetch } = useQuery(
        {
            queryKey: ['tripsdriver', day],
            queryFn: () => getTripsByDriver(JSON.parse(localStorage.getItem('driverid')), user?.access_token, day ? day : dayjs().format('YYYY-MM-DD')),
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
        setDay(time.format('YYYY-MM-DD'))
    }

    const onClickDetail = (trip) => {
        setTripSelected(trip)
    }

    const mutationStartTrip = useMutation({
        mutationFn: async (data) => {
            const { id, token } = data;
            return await updateTrip(id, token, { status: 'Started', driverId: JSON.parse(localStorage.getItem('driverid')) });
        },
        onSuccess: (data) => {
            successMes(data?.message)
            const index = listTrip.findIndex(item => item.id === data?.data.id)

            if (index !== -1) {
                const newListTrip = [...listTrip]
                newListTrip[index] = { ...listTrip[index], status: 'Started' }
                setListTrip(newListTrip)
            }
            setSelectedKeys('1')
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    });

    const handleStartTrip = (trip) => {
        mutationStartTrip.mutate({ id: trip.id, token: user?.access_token })
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
                        <Card style={{ width: 'calc(100% - 64px)', height: '180px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', marginBottom: 20, backgroundColor: '#faf3de' }}>
                            <Row style={{ display: 'flex', alignItems: 'center' }}>
                                <Col span={4} style={{ fontWeight: 'bold', fontSize: '40px', color: '#1890ff', textAlign: 'center' }}>{formatTime(trip.departureTime)}</Col>
                                <Col span={6} style={{ fontSize: '16px', color: '#666', textAlign: 'left' }}>
                                    <div><strong>Biển số xe:</strong> {trip.bus.licensePlate}</div>
                                    <div><strong>Loại xe:</strong> {trip.bus.typeBus} chỗ</div>
                                    <div><strong>Số ghế trống:</strong> {trip.totalSeats - trip.bookedSeats}</div>
                                    <div><strong>Số ghế đã đặt:</strong> {trip.bookedSeats}</div>
                                    <div><strong>Trạng thái: </strong>
                                        <Tag
                                            color={trip.status === 'NotStarted' ? 'error' : (trip.status === 'Ended' ? 'success' : 'warning')}
                                        >
                                            {trip.status === 'NotStarted' ? 'Chưa khởi hành' : (trip.status === 'Started' ? 'Đã khởi hành' : 'Đã kết thúc')}
                                        </Tag>
                                    </div>
                                </Col>
                                <Col span={10} style={{ fontSize: '16px', color: '#666', textAlign: 'left' }}>
                                    <div><strong>Điểm xuất phát:</strong> {trip.route.placeStart} - {trip.route.districtStart}</div>
                                    <div><strong>Thời gian di chuyển:</strong> {trip.route.journeyTime}</div>
                                    <div><strong>Điểm đến:</strong> {trip.route.placeEnd} - {trip.route.districtEnd}</div>
                                </Col>
                                <Col span={4} style={{ fontSize: '16px', color: '#666' }}>
                                    <Button onClick={() => onClickDetail(trip)} style={{ marginBottom: '16px' }} >Chi tiết</Button>
                                    {trip.status === 'NotStarted' && <Button onClick={() => handleStartTrip(trip)} type="primary" >Bắt đầu chuyến</Button>}
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