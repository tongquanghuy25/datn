import { Col, Form, Input, InputNumber, Modal, Radio, Row, Select, } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { errorMes, loadingMes, successMes } from '../../../../Message/Message';
import { Option } from 'antd/es/mentions';
import { getStopPointsByBusRoute } from '../../../../../services/RouteService';
import { createGoodsOrder, createTicketOrder } from '../../../../../services/OrderService';
import { calculateArrivalDateAndTime, calculateEndTime, getVnCurrency } from '../../../../../utils';



const ModalAddTicket = (props) => {
    const { trip, isAddTicket, setIsAddTicket, selectedEmptySeats, seatCount, handleRefretch } = props
    const [form] = Form.useForm();
    const formRef = useRef(null);
    const user = useSelector((state) => state.user)
    const [listPickUpPoint, setListPickUpPoint] = useState([])
    const [listDropOffPoint, setListDropOffPoint] = useState([])
    const [pickUpPoint, setPickUpPoint] = useState();
    const [dropOffPoint, setDropOffPoint] = useState();
    const [totalPrice, setTotalPricet] = useState(0);

    useEffect(() => {
        setTotalPricet(trip?.ticketPrice * seatCount || 0)
    }, [seatCount])

    const onCancel = () => {
        form.resetFields()
        setIsAddTicket(false)
        setPickUpPoint()
        setDropOffPoint()
        setTotalPricet(0)
    }

    // Get List Stop Point
    const { data: dataStopPoint, refetch } = useQuery(
        {
            queryKey: [`listStopPoint${trip?.route.id}`],
            queryFn: () => getStopPointsByBusRoute(trip?.route.id),
        });

    useEffect(() => {
        setListPickUpPoint(dataStopPoint?.data?.listPickUpPoint.sort((a, b) => a.timeFromStart - b.timeFromStart))
        setListDropOffPoint(dataStopPoint?.data?.listDropOffPoint.sort((a, b) => a.timeFromStart - b.timeFromStart))
    }, [dataStopPoint])

    const onSelectPickUpPoint = (value) => {
        let price = totalPrice
        console.log(totalPrice);
        const point = listPickUpPoint.find(item => item.id === value)
        if (pickUpPoint?.extracost) price = price - (pickUpPoint?.extracost)
        if (point?.extracost) price = price + (point?.extracost)

        setTotalPricet(price)
        setPickUpPoint(point)

    }
    const onSelectDropOffPoint = (value) => {
        let price = totalPrice
        const point = listDropOffPoint.find(item => item.id === value)
        if (dropOffPoint?.extracost) price = price - (dropOffPoint?.extracost)
        if (point?.extracost) price = price + (point?.extracost)

        setTotalPricet(price)
        setDropOffPoint(point)
    }

    //Finnish
    const mutation = useMutation(
        {
            mutationFn: (data) => {
                return createTicketOrder(data)
            },
            onSuccess: (data) => {
                handleRefretch()
                onCancel()
                successMes('Thêm vé thành công')
            },
            onError: (data) => {
                errorMes(data?.response?.data?.message)
            }
        }
    )
    const handleFinish = (values) => {
        const { arrivalDate, arrivalTime } = calculateArrivalDateAndTime(trip?.departureDate, trip?.departureTime, pickUpPoint.timeFromStart)
        const { arrivalDate: endDate, arrivalTime: endTime } = calculateArrivalDateAndTime(trip?.departureDate, trip?.departureTime, dropOffPoint.timeFromStart)

        const data = {
            tripId: trip?.id,
            name: values.name,
            email: values.email,
            phone: values.phone,
            userOrder: user?.id,

            departureTime: trip?.departureTime,
            departureDate: trip?.departureDate,

            pickUp: pickUpPoint.place,
            notePickUp: values.noteDropOff,
            timePickUp: arrivalTime,
            datePickUp: arrivalDate,

            dropOff: dropOffPoint.place,
            noteDropOff: values.notePickUp,
            timeDropOff: endTime,
            dateDropOff: endDate,

            seats: selectedEmptySeats,
            seatCount: trip?.prebooking ? seatCount : values.seatCount,

            ticketPrice: trip?.ticketPrice,
            extraCosts: ((pickUpPoint?.extracost || 0) + (dropOffPoint?.extracost || 0)),
            totalPrice,

            isPaid: values?.isPaid,
            payee: values?.isPaid ? user?.id : null,
        }
        mutation.mutate(data)
    };


    return (
        <div>
            <Modal
                title={<h3>Thêm vé</h3>}
                open={isAddTicket}
                okText='Xác nhận'
                onOk={() => {
                    formRef.current.submit()
                }}
                cancelText='Hủy'
                onCancel={onCancel}
                width={'50%'}
                style={{
                    top: 10,
                }}
            >
                <Form
                    ref={formRef}
                    layout="vertical"
                    form={form}
                    onFinish={handleFinish}
                >
                    <Row>
                        <Col span={10}>
                            <Form.Item label="Tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: "email", message: "Email không đúng định dạng !" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Số Điện Thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col offset={3} span={10}>
                            <Form.Item label="Điểm Đón" name="pickUpPoint" rules={[{ required: true, message: 'Vui lòng nhập địa điểm đón!' }]}>
                                <Select onSelect={onSelectPickUpPoint} placeholder='Chọn điểm đón' style={{ width: '100%' }} >
                                    {listPickUpPoint?.map(item => {
                                        return <Option value={item?.id}
                                        >
                                            {calculateEndTime(trip?.departureTime, item.timeFromStart)} {item.place} {item?.extracost ? `( Phụ phí ${getVnCurrency(item?.extracost)} )` : ''}
                                        </Option>
                                    }
                                    )}
                                </Select>
                            </Form.Item>
                            <Form.Item name="notePickUp">
                                <Input.TextArea rows={1} placeholder='Ghi chú' />
                            </Form.Item>


                            <Form.Item label="Điểm Trả" name="dropOffPoint" rules={[{ required: true, message: 'Vui lòng nhập địa điểm trả!' }]}>
                                <Select onSelect={onSelectDropOffPoint} placeholder='Chọn điểm trả' style={{ width: '100%' }} >
                                    {listDropOffPoint?.map(item => {
                                        return <Option value={item?.id}>
                                            {calculateEndTime(trip?.departureTime, item.timeFromStart)} {item.place} {item?.extracost ? `( Phụ phí ${getVnCurrency(item?.extracost)} )` : ''}
                                        </Option>
                                    }
                                    )}
                                </Select>
                            </Form.Item>
                            <Form.Item name="noteDropOff">
                                <Input.TextArea rows={1} placeholder='Ghi chú' />
                            </Form.Item></Col>
                    </Row>

                    <div style={{ borderTop: '1px solid #333', paddingTop: '20px', marginTop: '20px' }}></div>

                    <Row>
                        <Col span={12}>

                            {trip?.prebooking ? <>
                                <div>
                                    <span>Vị Trí Ghế : <b>{selectedEmptySeats?.join(', ')}</b></span>

                                </div>
                                <span>Số Lượng Ghế : <b>{seatCount}</b></span>
                            </>
                                :
                                <Form.Item label="Số lượng ghế" name="seatCount" rules={[{ required: true, message: 'Vui lòng nhập số lượng ghế!' }]}>
                                    <Input type='number'
                                        min={0}
                                        max={trip?.totalSeats}
                                        onChange={e => {
                                            setTotalPricet(trip?.ticketPrice * e.target.value + (pickUpPoint?.extracost || 0) + (dropOffPoint?.extracost || 0))
                                        }}
                                        style={{ width: 200 }} />
                                </Form.Item>
                            }
                        </Col>

                        <Col >
                            <Form.Item
                                name="isPaid"
                                label='Thanh toán'
                                rules={[
                                    {
                                        required: true,
                                        message: "Không được bỏ trống !",
                                    }
                                ]}>
                                <Radio.Group >
                                    <Radio value={true}>Đã thanh toán</Radio>
                                    {!trip?.paymentRequire && <Radio value={false}>Chưa thanh toán</Radio>}
                                </Radio.Group>
                            </Form.Item>
                            <Row justify={'end'}>
                                <h2>Tổng tiền: </h2>
                                <h2 style={{ color: 'red', marginLeft: '10px' }}>{getVnCurrency(totalPrice)}</h2>
                            </Row>
                        </Col>
                    </Row>

                </Form>
            </Modal>
        </div >
    )
}

export default ModalAddTicket