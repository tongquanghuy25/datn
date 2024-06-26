import { Col, Form, Input, Modal, Radio, Row, Select, } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { errorMes, loadingMes, successMes } from '../../../../Message/Message';
import { Option } from 'antd/es/mentions';
import { getStopPointsByBusRoute } from '../../../../../services/RouteService';
import { createGoodsOrder } from '../../../../../services/OrderService';
import { calculateArrivalDateAndTime, calculateEndTime, getVnCurrency } from '../../../../../utils';


const validateNumber = (_, value) => {
    const numberPattern = /^\d+$/;
    if (!numberPattern.test(value)) {
        return Promise.reject('Vui lòng nhập số!');
    }
    return Promise.resolve();
};

const ModalCreateGoodsOrder = (props) => {
    const { trip, isCreateGoods, setIsCreateGoods } = props
    const [form] = Form.useForm();
    const formRef = useRef(null);
    const user = useSelector((state) => state.user)
    const [listPickUpPoint, setListPickUpPoint] = useState([])
    const [listDropOffPoint, setListDropOffPoint] = useState([])

    const onCancel = () => {
        form.resetFields()
        // handleCancel()
        setIsCreateGoods(false)
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

    const mutation = useMutation(
        {
            mutationFn: (data) => {
                return createGoodsOrder(user?.access_token, data)
            },
            onSuccess: (data) => {
                successMes('Đặt vé thành công')
            },
            onError: (data) => {
                console.log('data', data);
                errorMes(data?.response?.data?.message)
            }
        }
    )

    const handleFinish = (values) => {
        const sendPoint = listPickUpPoint.find(item => item.id === values.sendLocation)
        const receivePoint = listDropOffPoint.find(item => item.id === values.receiveLocation)
        const { arrivalDate: dateSend, arrivalTime: timeSend } = calculateArrivalDateAndTime(trip.departureDate, trip.departureTime, sendPoint.timeFromStart)
        const { arrivalDate: dateReceive, arrivalTime: timeReceive } = calculateArrivalDateAndTime(trip.departureDate, trip.departureTime, receivePoint.timeFromStart)
        let data = {
            tripId: trip.id,
            departureDate: trip.departureDate,

            nameSender: values.senderName,
            emailSender: values.senderEmail,
            phoneSender: values.senderPhone,
            nameReceiver: values.receiverName,
            emailReceiver: values.receiverEmail,
            phoneReceiver: values.receiverPhone,

            sendPlace: sendPoint.place,
            timeSend: timeSend,
            dateSend: dateSend,
            noteSend: values.noteSend,

            receivePlace: receivePoint.place,
            timeReceive: timeReceive,
            dateReceive: dateReceive,
            noteReceive: values.noteReceive,


            goodsName: values.goodsName,
            goodsDescription: values.goodsDescription,
            price: values.price,

            isPaid: values.isPaid

        }

        if (values.isPaid === true) {
            data = { ...data, paymentMethod: values.paymentMethod }
        }
        // console.log('data', data);
        mutation.mutate(data)

    };

    return (
        <div>
            <Modal
                title={<h3>Thêm hàng hóa</h3>}
                open={isCreateGoods}
                okText='Xác nhận'
                onOk={() => {
                    formRef.current.submit()
                }}
                cancelText='Hủy'
                onCancel={onCancel}
                width={'90%'}
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
                    <Row justify={'space-between'} style={{ width: '80%' }}>
                        <Form.Item label="Tên Người Gửi" name="senderName" rules={[{ required: true, message: 'Vui lòng nhập tên người gửi!' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Email Người Gửi" name="senderEmail" rules={[{ required: true, message: 'Vui lòng nhập email người gửi!' }, { type: "email", message: "Email không đúng định dạng !" }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Số Điện Thoại Người Gửi" name="senderPhone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại người gửi!' }]}>
                            <Input />
                        </Form.Item>
                    </Row>
                    <Row justify={'space-between'} style={{ width: '80%' }}>
                        <Form.Item label="Tên Người Nhận" name="receiverName" rules={[{ required: true, message: 'Vui lòng nhập tên người nhận!' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Email người Nhận" name="receiverEmail" rules={[{ required: true, message: 'Vui lòng nhập email người gửi!' }, { type: "email", message: "Email không đúng định dạng !" }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Số Điện Thoại Người Nhận" name="receiverPhone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại người nhận!' }]}>
                            <Input />
                        </Form.Item>
                    </Row>
                    <Row>
                        <Col span={10}>

                            <Form.Item label="Địa Điểm Gửi" name="sendLocation" rules={[{ required: true, message: 'Vui lòng nhập địa điểm gửi!' }]}>
                                <Select placeholder='Chọn điểm gửi hàng' style={{ width: '100%' }} >
                                    {listPickUpPoint?.map(item => {
                                        return <Option value={item?.id}>
                                            {calculateEndTime(trip?.departureTime, item.timeFromStart)} {item.place}
                                        </Option>
                                    }
                                    )}
                                </Select>
                            </Form.Item>
                            <Form.Item name="noteSend">
                                <Input.TextArea rows={1} placeholder='Ghi chú' />
                            </Form.Item>
                            {/* <Form.Item label="Thời Gian Gửi" name="pickupTime" rules={[{ required: true, message: 'Vui lòng chọn thời gian gửi!' }]}>
                                <DatePicker showTime />
                            </Form.Item> */}
                            <Form.Item label="Tên hàng hóa" name="goodsName" rules={[{ required: true, message: 'Vui lòng điền đầy đủ thông tin!' }]}>
                                <Input.TextArea />
                            </Form.Item>



                        </Col>
                        <Col offset={3} span={10}>

                            <Form.Item label="Địa Điểm Nhận" name="receiveLocation" rules={[{ required: true, message: 'Vui lòng nhập địa điểm nhận!' }]}>
                                <Select placeholder='Chọn điểm nhận hàng' style={{ width: '100%' }} >
                                    {listDropOffPoint?.map(item => {
                                        return <Option value={item?.id}>
                                            {calculateEndTime(trip?.departureTime, item.timeFromStart)} {item.place}
                                        </Option>
                                    }
                                    )}
                                </Select>
                            </Form.Item>
                            <Form.Item name="noteReceive">
                                <Input.TextArea rows={1} placeholder='Ghi chú' />
                            </Form.Item>
                            {/* <Form.Item label="Thời Gian Nhận" name="dropoffTime" rules={[{ required: true, message: 'Vui lòng chọn thời gian nhận!' }]}>
                                <DatePicker showTime />
                            </Form.Item> */}
                            <Form.Item label="Mô tả hàng hóa" name="goodsDescription" rules={[{ required: true, message: 'Vui lòng điền đầy đủ thông tin!' }]}>
                                <Input.TextArea />
                            </Form.Item>



                        </Col>

                    </Row>


                    <Row justify={'space-between'} style={{ width: '80%' }}>
                        <Form.Item label="Giá Tiền" name="price" rules={[{ validator: validateNumber }]}>
                            <Input />
                        </Form.Item>
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
                                <Radio value={false}>Chưa thanh toán</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item label="Phương Thức Thanh Toán" name="paymentMethod" >
                            <Select style={{ width: '300px' }}>
                                <Option value="Tiền mặt">Tiền Mặt</Option>
                                <Option value="Chuyển khoản">Chuyển Khoản Ngân Hàng</Option>
                            </Select>
                        </Form.Item>
                    </Row>

                </Form>
            </Modal>
        </div >
    )
}

export default ModalCreateGoodsOrder