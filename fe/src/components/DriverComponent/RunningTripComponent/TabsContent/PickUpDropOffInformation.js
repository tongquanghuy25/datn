import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Col, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { getStopPointsByBusRoute } from '../../../../services/RouteService';
import { updateStatusTicketOrder } from '../../../../services/OrderService';
import { errorMes, successMes } from '../../../Message/Message';
import { useSelector } from 'react-redux'



function calculateArrivalTime(startTime, duration) {
    // Chuyển đổi chuỗi 'hh:mm' thành giờ và phút
    const [startHour, startMinute] = startTime?.split(':').map(Number);
    // const [durationHour, durationMinute] = duration?.split(':').map(Number);
    const durationHour = parseInt(duration / 60)
    const durationMinute = duration % 60
    // Tính toán thời gian đến
    let arrivalHour = startHour + durationHour;
    let arrivalMinute = startMinute + durationMinute;

    // Xử lý trường hợp khi phút vượt quá 60
    if (arrivalMinute >= 60) {
        arrivalHour += Math.floor(arrivalMinute / 60);
        arrivalMinute %= 60;
    }

    if (arrivalHour > 24) {
        arrivalHour = arrivalHour % 24
    }

    // Định dạng thời gian đến
    const formattedArrivalMinute = arrivalMinute.toString().padStart(2, '0'); // Thêm số 0 phía trước nếu cần
    const formattedArrivalHour = arrivalHour.toString().padStart(2, '0'); // Thêm số 0 phía trước nếu cần
    const arrivalTime = `${formattedArrivalHour}:${formattedArrivalMinute}`;


    return arrivalTime;
}

const PickUpDropOffInformation = ({ listOrder, handleUpdateStatusSeat, departureTime, routeId }) => {

    const user = useSelector((state) => state.user);
    const [listData, setListData] = useState([])
    const [listStopPoint, setListStopPoint] = useState([])
    const [placeSelected, setPlaceSelected] = useState()
    const [placeSelectedData, setPlaceSelectedData] = useState()


    const { data: dataStopPoint, refetch } = useQuery(
        {
            queryKey: [`listStopPoint${routeId}`],
            queryFn: () => getStopPointsByBusRoute(routeId),
        });

    useEffect(() => {
        let pickup = dataStopPoint?.data?.listPickUpPoint?.map(item => {
            return {
                name: item.place,
                timeFromStart: item.timeFromStart
            }
        })
        let dropOff = dataStopPoint?.data?.listDropOffPoint?.map(item => {
            return {
                name: item.place,
                timeFromStart: item.timeFromStart

            }
        })
        let point = []
        if (Array.isArray(pickup) && Array.isArray(dropOff)) {
            point = [...pickup, ...dropOff]?.sort((a, b) => a.timeFromStart - b.timeFromStart)
        }
        setListStopPoint(point)
    }, [dataStopPoint])


    useEffect(() => {
        let data = listStopPoint.map(item => {
            const orders = listOrder.filter(elemet => elemet.pickUp === item.name || elemet.dropOff === item.name).map(it => {
                return {
                    id: it._id,
                    phone: it.phone,
                    seatCount: it.seatCount,
                    seats: it.seats,
                    totalPrice: it.totalPrice,
                    isPaid: it.isPaid,
                    isPickUp: it.pickUp === item.name,
                    status: it.status
                }
            })
            return {
                placeName: item.name,
                data: orders
            }
        })
        setListData(data)
        if (data?.length > 0) {
            setPlaceSelected(data[0].placeName)
            setPlaceSelectedData(data?.find(it => it?.placeName === data[0].placeName)?.data)
        }

    }, [listOrder, listStopPoint])


    const mutationUpdate = useMutation({
        mutationFn: async (data) => {
            const { id, token, status } = data;
            return await updateStatusTicketOrder(id, token, { status: status });
        },
        onSuccess: (data) => {

            const listData = placeSelectedData
            const index = listData?.findIndex(item => item.id === data.data._id)
            listData[index].status = data.data.status
            setPlaceSelectedData(listData)
            handleUpdateStatusSeat(data.data._id)
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    });
    return (
        <div >
            <Row>
                <Col style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', padding: '5px' }} span={6}>
                    {
                        listStopPoint?.map((item) =>
                        (
                            <div
                                onClick={() => {
                                    setPlaceSelected(item.name)
                                    setPlaceSelectedData(listData?.find(it => it?.placeName === item.name)?.data)
                                }}
                                style={{ marginLeft: 10, fontSize: '18px', padding: 10, border: '1px solid #333', marginBottom: '10px', borderRadius: '10px', cursor: 'pointer', backgroundColor: item.name === placeSelected ? '#fa8282' : '#ede9e4' }}>
                                {calculateArrivalTime(departureTime, item.timeFromStart)} - {item.name}
                            </div>
                        ))
                    }
                </Col>
                <Col offset={2} span={15} style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', border: '1px solid #333', padding: '20px' }}>
                    {
                        placeSelectedData && placeSelectedData.length ? (
                            placeSelectedData.map(item =>
                                <>
                                    <Row
                                        style={{ height: '80px', marginLeft: 10, padding: 10, border: '1px solid #333', marginBottom: '10px', borderRadius: '10px', backgroundColor: '#dcf7ec' }}>
                                        <Col span={9} style={{ fontSize: '16px' }}>
                                            <div><strong>Số lượng hành khách: </strong>{item.seatCount}</div>
                                            <div><strong>Vị trí ghế: </strong>{item.seats.toString()}</div>
                                        </Col>

                                        <Col span={10} style={{ fontSize: '16px' }}>
                                            <div><strong>Số điện thoại: </strong>{item.phone}</div>
                                            <div><strong>Tổng số tiền: </strong>{item.totalPrice}</div>
                                        </Col>

                                        <Col span={5} align="middle" style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                            {
                                                item?.isPickUp ? (
                                                    item?.status === 'Đã lên xe' ?
                                                        <div
                                                            key={item._id}
                                                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '110px', height: '50px', borderRadius: '20px', backgroundColor: '#4169e1', color: '#ffffff', fontSize: '16px', fontWeight: 'bold' }}
                                                        >
                                                            Đã đón khách
                                                        </div>
                                                        :
                                                        <Button onClick={() => { mutationUpdate.mutate({ id: item.id, token: user?.access_token, status: 'Đã lên xe' }) }} type='primary' danger>Xác nhận đón</Button>
                                                )
                                                    :
                                                    (
                                                        item?.status === 'Đã hoàn thành' ?
                                                            <div
                                                                key={item._id}
                                                                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '110px', height: '50px', borderRadius: '20px', backgroundColor: '#008000', color: 'white', fontSize: '16px', fontWeight: 'bold' }}
                                                            >
                                                                Đã trả khách
                                                            </div>
                                                            :
                                                            <Button onClick={() => { mutationUpdate.mutate({ id: item.id, token: user?.access_token, status: 'Đã hoàn thành' }) }} type='primary'>Xác nhận trả</Button>
                                                    )
                                            }
                                        </Col>
                                    </Row >
                                </>

                            )
                        )
                            : <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Không có dữ liệu</div>
                    }
                </Col>
            </Row>

        </div >
    )
}

export default PickUpDropOffInformation