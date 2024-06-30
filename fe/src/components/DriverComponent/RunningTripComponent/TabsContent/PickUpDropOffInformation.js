import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Col, Row, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { getStopPointsByBusRoute } from '../../../../services/RouteService';
import { updateStatusGoodsOrder, updateTicketOrder } from '../../../../services/OrderService';
import { errorMes, successMes } from '../../../Message/Message';
import { useSelector } from 'react-redux'
import { calculateArrivalTime, calculateEndTime, formatTime } from '../../../../utils';



// function calculateArrivalTime(startTime, duration) {
//     // Chuyển đổi chuỗi 'hh:mm' thành giờ và phút
//     const [startHour, startMinute] = startTime?.split(':').map(Number);
//     // const [durationHour, durationMinute] = duration?.split(':').map(Number);
//     const durationHour = parseInt(duration / 60)
//     const durationMinute = duration % 60
//     // Tính toán thời gian đến
//     let arrivalHour = startHour + durationHour;
//     let arrivalMinute = startMinute + durationMinute;

//     // Xử lý trường hợp khi phút vượt quá 60
//     if (arrivalMinute >= 60) {
//         arrivalHour += Math.floor(arrivalMinute / 60);
//         arrivalMinute %= 60;
//     }

//     if (arrivalHour > 24) {
//         arrivalHour = arrivalHour % 24
//     }

//     // Định dạng thời gian đến
//     const formattedArrivalMinute = arrivalMinute.toString().padStart(2, '0'); // Thêm số 0 phía trước nếu cần
//     const formattedArrivalHour = arrivalHour.toString().padStart(2, '0'); // Thêm số 0 phía trước nếu cần
//     const arrivalTime = `${formattedArrivalHour}:${formattedArrivalMinute}`;


//     return arrivalTime;
// }

const PickUpDropOffInformation = ({ listGoodsOrder, listTicketOrder, handleUpdateStatusSeat, departureTime, routeId, handleUpdateStatusGoods }) => {

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
            const ordersTicket = listTicketOrder.filter(elemet => elemet.pickUp === item.name || elemet.dropOff === item.name).map(it => {
                return {
                    id: it.id,
                    phone: it.phone,
                    seatCount: it.seatCount,
                    seats: it.seats,
                    totalPrice: it.totalPrice,
                    isPaid: it.isPaid,
                    isPickUp: it.pickUp === item.name,
                    status: it.status
                }
            })

            const ordersGoods = listGoodsOrder.filter(elemet => elemet.sendPlace === item.name || elemet.receivePlace === item.name).map(it => {
                return {
                    id: it.id,
                    goodsName: it.goodsName,
                    goodsDescription: it.goodsDescription,
                    isPaid: it.isPaid,
                    status: it.status,
                    price: it.price,
                    phone: it.sendPlace === item.name ? it.phoneSender : it.phoneReceiver,
                    isSend: it.sendPlace === item.name,
                }
            })
            return {
                placeName: item.name,
                data: { ordersTicket, ordersGoods }
            }
        })
        setListData(data)
        if (data?.length > 0) {
            setPlaceSelected(data[0].placeName)
            setPlaceSelectedData(data?.find(it => it?.placeName === data[0].placeName)?.data)
        }

    }, [listTicketOrder, listStopPoint])


    const mutationUpdate = useMutation({
        mutationFn: async (data) => {
            const { id, token, ...rest } = data;
            return await updateTicketOrder(id, token, rest);
        },
        onSuccess: (data) => {
            const listData = placeSelectedData
            const index = listData?.ordersTicket?.findIndex(item => item.id === data.data?.id)
            listData.ordersTicket[index].status = data.data?.status
            listData.ordersTicket[index].isPaid = data.data?.isPaid
            setPlaceSelectedData(listData)
            handleUpdateStatusSeat(data.data?.id, data.data?.status, data.data?.isPaid)
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    });

    const mutationUpdateGoods = useMutation({
        mutationFn: async (data) => {
            const { id, token, ...rest } = data;
            return await updateStatusGoodsOrder(id, token, rest);
        },
        onSuccess: (data) => {

            const listData = placeSelectedData
            const index = listData?.ordersGoods?.findIndex(item => item.id === data.data.id)
            listData.ordersGoods[index].status = data.data.status
            listData.ordersGoods[index].isPaid = data.data.isPaid
            setPlaceSelectedData(listData)
            handleUpdateStatusGoods(data.data.id, data.data.status, data.data.isPaid)
        },
        onError: (data) => {
            console.log('aaa', data);
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
                                {calculateEndTime(departureTime, item.timeFromStart)} - {item.name}
                            </div>
                        ))
                    }
                </Col>
                <Col offset={2} span={15} style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', border: '1px solid #333', padding: '20px' }}>
                    {
                        placeSelectedData?.ordersTicket?.length > 0 || placeSelectedData?.ordersGoods?.length ? (

                            <>
                                {
                                    placeSelectedData?.ordersTicket?.map(item =>
                                        <>
                                            <Row
                                                style={{ height: '80px', marginLeft: 10, padding: 10, border: '1px solid #333', marginBottom: '10px', borderRadius: '10px', backgroundColor: '#dcf7ec' }}>
                                                <Col span={9} style={{ fontSize: '16px' }}>
                                                    <div><strong>Số lượng hành khách: </strong>{item.seatCount}</div>
                                                    <div><strong>Vị trí ghế: </strong>{JSON.parse(item.seats).toString()}</div>
                                                </Col>

                                                <Col span={10} style={{ fontSize: '16px' }}>
                                                    <div><strong>Số điện thoại: </strong>{item.phone}</div>
                                                    <div><strong>Tổng số tiền: </strong>{item.totalPrice}</div>
                                                </Col>

                                                <Col span={5} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                    {
                                                        item?.isPickUp ?
                                                            (
                                                                item?.status === 'Boarded' ?
                                                                    <Tag color='blue'>Đã đón khách</Tag>
                                                                    :
                                                                    <Button onClick={() => { mutationUpdate.mutate({ id: item.id, token: user?.access_token, status: 'Boarded' }) }} type='primary' size='small' danger>Xác nhận đón</Button>
                                                            )
                                                            :
                                                            (
                                                                item?.status === 'Completed' ?
                                                                    <Tag color='green'>Đã trả khách</Tag>
                                                                    :
                                                                    (
                                                                        item?.status === 'Boarded' ? <Button onClick={() => { mutationUpdate.mutate({ id: item.id, token: user?.access_token, status: 'Completed' }) }} type='primary' size='small'>Xác nhận trả</Button>
                                                                            : <div></div>
                                                                    )
                                                            )
                                                    }
                                                    {
                                                        item?.isPaid ?
                                                            <Tag color='green'>Đã thanh toán</Tag>
                                                            :
                                                            <Button onClick={() => { mutationUpdate.mutate({ id: item.id, token: user?.access_token, isPaid: true }) }} type='primary' danger size='small'>Thanh toán</Button>
                                                    }
                                                </Col>
                                            </Row >
                                        </>

                                    )
                                }

                                {
                                    placeSelectedData?.ordersGoods?.map(item =>
                                        <>
                                            <Row
                                                gutter={[8, 8]}
                                                style={{ height: '80px', marginLeft: 10, padding: 10, border: '1px solid #333', marginBottom: '10px', borderRadius: '10px', backgroundColor: '#f5eacb' }}>
                                                <Col span={10} style={{ fontSize: '16px' }}>
                                                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><strong>Hàng hóa: </strong>{item.goodsName}</div>
                                                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><strong>Mô tả: </strong>{item.goodsDescription}</div>
                                                </Col>

                                                <Col span={9} style={{ fontSize: '16px' }}>
                                                    <div><strong>Số điện thoại: </strong>{item.phone}</div>
                                                    <div><strong>Tổng số tiền: </strong>{item.price}</div>
                                                </Col>

                                                <Col span={5} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                    {
                                                        item?.isSend ? (
                                                            item?.status === 'Received' ?
                                                                <Tag color='blue'>Đã nhận hàng</Tag>
                                                                :
                                                                <Button onClick={() => { mutationUpdateGoods.mutate({ id: item.id, token: user?.access_token, status: 'Received' }) }} type='primary' size='small' danger>Nhận hàng</Button>
                                                        )
                                                            :
                                                            (
                                                                item?.status === 'Delivered' ?
                                                                    <Tag>Đã trả hàng</Tag>
                                                                    :
                                                                    (
                                                                        item?.status === 'Received' ? <Button onClick={() => { mutationUpdateGoods.mutate({ id: item.id, token: user?.access_token, status: 'Delivered' }) }} size='small' type='primary'>Trả hàng</Button>
                                                                            : <div></div>
                                                                    )
                                                            )
                                                    }
                                                    {
                                                        item?.isPaid ?
                                                            <Tag color='green'>Đã thanh toán</Tag>
                                                            :
                                                            (

                                                                <Button onClick={() => { mutationUpdateGoods.mutate({ id: item.id, token: user?.access_token, isPaid: true }) }} type='primary' danger size='small'>Thanh toán</Button>

                                                            )

                                                    }
                                                </Col>
                                            </Row >
                                        </>

                                    )
                                }
                            </>

                        )
                            : <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Không có dữ liệu</div>
                    }
                </Col>
            </Row>

        </div >
    )
}

export default PickUpDropOffInformation