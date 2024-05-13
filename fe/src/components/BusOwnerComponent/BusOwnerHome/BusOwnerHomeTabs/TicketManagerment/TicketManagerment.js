import { Button, Col, DatePicker, Input, Row, Select, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getTripsByBusOwner } from '../../../../../services/TripService';
import { errorMes } from '../../../../Message/Message';
import { Option } from 'antd/es/mentions';
import { getTicketOrderByTrip } from '../../../../../services/OrderService';
import { getListSeat } from '../../../../../utils/ListSeat';
const { Search } = Input;

const TicketManagerment = () => {
    const user = useSelector((state) => state.user)
    const [day, setDay] = useState(dayjs().format('DD/MM/YYYY'))
    const [listTrip, setListTrip] = useState([])
    const [tripId, setTripId] = useState()
    const [listTicketOrder, setListTicketOrder] = useState([])
    const [listSeat, setListSeat] = useState([])


    const onChangeDate = (time, timeString) => {
        setDay(timeString)
    }

    //Get all trip
    const { data, isSuccess, isError } = useQuery(
        {
            queryKey: [`trips`, day],
            queryFn: () => getTripsByBusOwner(JSON.parse(localStorage.getItem('bus_owner_id')), user?.access_token, day ? day : dayjs().format('DD/MM/YY')),
            // staleTime: 300000,
        });
    useEffect(() => {
        if (isSuccess) {
            setListTrip(data?.data)
        } else if (isError) {
            errorMes()
        }

    }, [isSuccess, isError, data])

    //Get tickets by trip
    const mutation = useMutation({
        mutationFn: async (data) => {
            const { tripId, token } = data;
            return await getTicketOrderByTrip(token, tripId);
        },
        onSuccess: (data) => {
            setListTicketOrder(data?.data)
            // successMes(data?.message)
            const typeBus = listTrip?.find(item => item._id === tripId)?.busId.typeBus
            const list = getListSeat(typeBus, data?.data)
            setListSeat(list)

        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    });

    const handleSelectTrip = (value) => {
        setTripId(value);
        mutation.mutate({ tripId: value, token: user?.access_token })
    }

    return (
        <div>
            <Row style={{ margin: '10px 0 0 20px' }}>
                <div>
                    <div>Chọn ngày</div>
                    <DatePicker
                        format='DD/MM/YYYY'
                        style={{ width: '150px' }}
                        placeholder='Chọn ngày'
                        defaultValue={dayjs()}
                        onChange={onChangeDate}
                    />
                </div>
                <div style={{ width: '400px', marginLeft: '30px' }}>
                    <div>Chọn chuyến</div>
                    <Select placeholder='Chọn chuyến xe' style={{ width: '400px' }} onSelect={(value) => { handleSelectTrip(value) }}>
                        {listTrip?.map(item => {
                            return <Option value={item._id}>
                                <Tag color='error'>{item.departureTime}</Tag>
                                <Tag color='warning'>{item.busId.licensePlate}</Tag>
                                {item.routeId.districtStart}-{item.routeId.districtEnd}
                            </Option>
                        }
                        )}
                    </Select>
                </div>
                <div style={{ width: 200, marginLeft: '30px' }}>
                    <label>Tìm kiếm theo id đơn vé</label>
                    <Search
                        placeholder="Nhập id đơn hàng"
                    //   onSearch={onSearch}

                    />

                </div>

            </Row>
            <Row>
                <div style={{ maxHeight: 'calc(100vh - 170px)', overflowY: 'auto', margin: '20px' }}>
                    <div style={{ display: 'flex', flex: 1, flexWrap: 'wrap', gap: '16px' }}>
                        {listSeat.map(seat => (

                            <Col style={{ flex: '0 0 calc(25% - 16px)' }} key={seat.id}>
                                <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #666', borderRadius: '10px', padding: '5px 10px', height: '210px', backgroundColor: '#fff' }}>
                                    {seat.data ?
                                        <>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ fontSize: '24px', fontWeight: 'bold', marginLeft: '10px' }}> {seat.id}</div>
                                                <b style={{ color: 'orange', fontSize: '20px' }}>(G{seat.data.seatCount})</b>
                                                <Tag
                                                    color={seat.data.status === 'Đã lên xe' ? 'blue' : (seat.data.status === 'Đã hoàn thành' ? 'success' : 'warning')}
                                                >
                                                    {seat.data.status === 'Đã lên xe' ? seat.data.status : (seat.data.status === 'Đã hoàn thành' ? seat.data.status : 'Chưa lên xe')}
                                                </Tag>
                                            </div>
                                            <div style={{ fontSize: '20px', fontWeight: '500', marginTop: '5px' }}>{seat.data.phone}</div>
                                            <div><strong>Đón : </strong> {seat.data.pickUp} {seat.data.notePickUp && `(${seat.data.notePickUp})`}</div>
                                            <div><strong>Trả : </strong> {seat.data.dropOff} {seat.data.noteDropOff && `(${seat.data.noteDropOff})`} </div>
                                            <div style={{ marginBottom: '10px', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex' }}>
                                                    <strong>Giá vé : </strong> {seat.data.ticketPrice}
                                                </div>
                                                {seat.data.isPaid ? <Tag color='success'>Đã thanh toán</Tag> : <Button style={{ marginLeft: '10px' }} size='small' type='primary' danger>Thanh toán</Button>}
                                                {/* <Popover content="Chi tiết vé" >
                                    <FileTextOutlined onClick={() => { setVisible(true); getTicketOrderDetail(seat.data.orderId) }} style={{ fontSize: '20px' }} />
                                </Popover> */}

                                            </div>
                                        </>
                                        :
                                        <>
                                            <div style={{ fontSize: '24px', fontWeight: 'bold', marginLeft: '10px' }}> {seat.id}</div>
                                            <Row justify={'center'} style={{}}><h2>Ghế trống</h2></Row>
                                        </>
                                    }
                                </div>

                            </Col>


                        ))}
                    </div>

                </div>
            </Row>
        </div>
    )
}

export default TicketManagerment