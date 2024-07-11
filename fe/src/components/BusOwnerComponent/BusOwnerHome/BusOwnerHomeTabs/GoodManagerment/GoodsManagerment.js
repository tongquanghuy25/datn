import { Button, DatePicker, Row, Select, Tag, Input, Col, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import nodata from '../../../../../acess/nodata.jpg'
import dayjs from 'dayjs';
import { PlusOutlined, DeleteOutlined, EditOutlined, ProfileOutlined } from '@ant-design/icons';
import ModalCreateGoodsOrder from './ModalCreateGoodsOrder';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getTripsByBusOwner } from '../../../../../services/TripService';
import { useSelector } from 'react-redux';
import { errorMes, successMes } from '../../../../Message/Message';
import { Option } from 'antd/es/mentions';
import { deleteGoodsOrder, getGoodsOrderByTrip } from '../../../../../services/OrderService';
import ModalUpdateGoodsOrder from './ModalUpdateGoodsOrder';
import { formatTime } from '../../../../../utils';
const { Search } = Input;


const GoodsManagerment = () => {
    const user = useSelector((state) => state.user)
    const [day, setDay] = useState(dayjs().format('DD/MM/YYYY'))
    const [isCreateGoods, setIsCreateGoods] = useState(false)
    const [isUpdateGoods, setIsUpdateGoods] = useState(false)
    const [isDeleteGoods, setIsDeleteGoods] = useState(false)
    const [listTrip, setListTrip] = useState([])
    const [tripId, setTripId] = useState()
    const [listGoodsOrder, setListGoodsOrder] = useState([])
    const [goodsOrder, setGoodsOrder] = useState()


    const onChangeDate = (time, timeString) => {
        setDay(time.format('YYYY-MM-DD'))
    }

    //Get all trip
    const { data, isSuccess, isError } = useQuery(
        {
            queryKey: [`trips`, day],
            queryFn: () => getTripsByBusOwner(JSON.parse(localStorage.getItem('bus_owner_id')), user?.access_token, day ? day : dayjs().format('YYYY-MM-DD')),
            // staleTime: 300000,
        });
    useEffect(() => {
        if (isSuccess) {
            setListTrip(data?.data)
        } else if (isError) {
            errorMes()
        }

    }, [isSuccess, isError, data])


    //Get goods by trip
    const mutation = useMutation({
        mutationFn: async (data) => {
            const { tripId, token } = data;
            return await getGoodsOrderByTrip(token, tripId);
        },
        onSuccess: (data) => {
            setListGoodsOrder(data?.data)
            // successMes(data?.message)

        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    });

    const handleSelectTrip = (value) => {
        setTripId(value);
        mutation.mutate({ tripId: value, token: user?.access_token })
    }

    const handelEditGoods = (goodsOrder) => {
        setIsUpdateGoods(true)
        setGoodsOrder(goodsOrder)
    }

    const handleRefetchGoodsOrder = () => {
        mutation.mutate({ tripId: tripId, token: user?.access_token })

    }

    const onDeleteGoods = (goodsOrder) => {
        setIsDeleteGoods(true)
        setGoodsOrder(goodsOrder)
    }


    const mutationDelete = useMutation({
        mutationFn: async (data) => {
            const { goodsOrderId, token, busOwnerId } = data;
            return await deleteGoodsOrder(goodsOrderId, token, { busOwnerId });
        },
        onSuccess: (data) => {
            successMes(data?.message)
            setIsDeleteGoods(false)
            setGoodsOrder()
            handleRefetchGoodsOrder()
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    });
    const handelDeleteGoods = () => {
        mutationDelete.mutate({ goodsOrderId: goodsOrder.id, token: user?.access_token, busOwnerId: JSON.parse(localStorage.getItem('bus_owner_id')) })
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
                            return <Option value={item.id}>
                                <Tag color='error'>{formatTime(item.departureTime)}</Tag>
                                <Tag color='warning'>{item.bus.licensePlate}</Tag>
                                {item.route.districtStart}-{item.route.districtEnd}
                            </Option>
                        }
                        )}
                    </Select>
                </div>
                <div style={{ width: 200, marginLeft: '30px' }}>
                    <label>Tìm kiếm theo id đơn hàng</label>
                    <Search
                        placeholder="Nhập id đơn hàng"
                    //   onSearch={onSearch}

                    />

                </div>

            </Row>
            {tripId && <div>
                <Row justify={'space-between'} align={'middle'}>

                    <div style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', flex: '1' }}>
                        Danh sách đơn gửi hàng hóa
                    </div>
                    <div>
                        <Button type="primary" onClick={() => { setIsCreateGoods(true) }} icon={<PlusOutlined />} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', marginBottom: '20px', marginRight: '60px' }}>
                            Thêm hàng hóa
                        </Button>
                    </div>
                    {isCreateGoods && <ModalCreateGoodsOrder trip={listTrip.find(item => item.id === tripId)} isCreateGoods={isCreateGoods} setIsCreateGoods={setIsCreateGoods}></ModalCreateGoodsOrder>}
                </Row>
                <Row style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                    {listGoodsOrder?.length > 0 ?
                        listGoodsOrder?.map(goodsOrder => {
                            return (
                                <>
                                    <Row style={{ margin: '10px', padding: '10px', width: '100%', height: '150px', borderRadius: '20px', border: '1px solid #666', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', backgroundColor: 'white' }}>
                                        <Col span={6}>
                                            <div><strong>Tên người gửi:</strong> {goodsOrder.nameSender}</div>
                                            <div><strong>Số điện thoại người gửi:</strong> {goodsOrder.phoneSender}</div>
                                            <div><strong>Địa điểm gửi hàng:</strong> {goodsOrder.sendPlace}</div>
                                            <div><strong>Ghi chú:</strong> {goodsOrder.noteSend}</div>
                                            <div><strong>Thời gian gửi hàng:</strong> {formatTime(goodsOrder.timeSend)} ngày {dayjs(goodsOrder.dateSend).format('DD-MM-YYYY')}</div>
                                        </Col>

                                        <Col span={6}>
                                            <div><strong>Tên người nhận:</strong> {goodsOrder.nameReceiver}</div>
                                            <div><strong>Số điện thoại người nhận:</strong> {goodsOrder.phoneReceiver}</div>
                                            <div><strong>Địa điểm nhận hàng:</strong> {goodsOrder.receivePlace}</div>
                                            <div><strong>Ghi chú:</strong> {goodsOrder.noteReceive}</div>
                                            <div><strong>Thời gian nhận hàng:</strong> {formatTime(goodsOrder.timeReceive)} ngày {dayjs(goodsOrder.dateReceive).format('DD-MM-YYYY')}</div>
                                        </Col>

                                        <Col span={8}>
                                            <div><strong>Tên hàng hóa:</strong> {goodsOrder.goodsName}</div>
                                            <div><strong>Mô tả hàng hóa:</strong> {goodsOrder.goodsDescription}</div>


                                        </Col>
                                        <Col span={4} style={{ display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', }} >
                                            <div>
                                                <div><strong>Giá:</strong> {goodsOrder.price} {goodsOrder.isPaid ? <Tag color='success'>Đã thanh toán</Tag> : <Tag color='error'>Chưa thanh toán</Tag>}</div>
                                                <div><strong>Trạng thái:</strong> {goodsOrder.status === 'Pending' ? 'Chưa nhận hàng' : (goodsOrder.status === 'Received' ? 'Đã nhận hàng' : 'Đã trả hàng')}</div>
                                            </div>
                                            <div>
                                                <Button type='primary' onClick={() => { handelEditGoods(goodsOrder) }}>Chỉnh sửa</Button>
                                                <Button type='primary' onClick={() => { onDeleteGoods(goodsOrder) }} danger style={{ marginLeft: '10px' }}>Xóa</Button>
                                            </div>
                                        </Col>

                                    </Row>

                                </>
                            )
                        })
                        :
                        <div style={{ fontSize: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', marginTop: 40 }}>
                            <img src={nodata} style={{ maxWidth: '300px' }}></img>
                            <h2>Chưa có đơn hàng hóa nào</h2>
                        </div>
                    }
                </Row>
                {isUpdateGoods && <ModalUpdateGoodsOrder handleRefetchGoodsOrder={handleRefetchGoodsOrder} trip={listTrip.find(item => item.id === tripId)} goodsOrder={goodsOrder} isUpdateGoods={isUpdateGoods} setIsUpdateGoods={setIsUpdateGoods}></ModalUpdateGoodsOrder>}
                {isDeleteGoods &&
                    <Modal
                        title='Bạn có chắc chắn muốn xóa nhà xe ?'
                        open={isDeleteGoods}
                        okText='Xác nhận'
                        onOk={() => {
                            handelDeleteGoods()
                        }}
                        cancelText='Hủy'
                        onCancel={() => {
                            setIsDeleteGoods(false)
                            setGoodsOrder()
                        }}
                    />
                }
            </div>}
        </div >
    )
}

export default GoodsManagerment