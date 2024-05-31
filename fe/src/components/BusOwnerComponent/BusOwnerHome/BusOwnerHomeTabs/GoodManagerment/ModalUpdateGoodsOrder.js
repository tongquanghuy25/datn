import { Col, Form, Input, Modal, Radio, Row, Select, } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { errorMes, loadingMes, successMes } from '../../../../Message/Message';
import { Option } from 'antd/es/mentions';
import { getStopPointsByBusRoute } from '../../../../../services/RouteService';
import { createGoodsOrder, updateGoodsOrder } from '../../../../../services/OrderService';


function calculateTime(startTime, minutes) {
    const [startHour] = startTime.split('giờ').map(str => parseInt(str.trim()));
    const totalMins = startHour * 60 + minutes;
    let endHours = Math.floor(totalMins / 60) % 24;
    let endMins = totalMins % 60;

    // Định dạng giờ và phút thành chuỗi 'hh:mm'
    const formattedHours = endHours < 10 ? `0${endHours}` : `${endHours}`;
    const formattedMins = endMins < 10 ? `0${endMins}` : `${endMins}`;

    return `${formattedHours}h${formattedMins}`;
}

function calculateArrivalDateAndTime(departureDate, departureTime, durationInMinutes) {
    // Chia chuỗi ngày đi thành các thành phần ngày, tháng và năm
    const [day, month, year] = departureDate?.split('/')?.map(Number);

    // Tách giờ và phút từ chuỗi giờ đi
    // const [, hours, minutes] = departureTime.match(/(\d+) giờ (\d+)/)?.map(Number);
    const [hours, minutes] = departureTime.split(':')

    // Kiểm tra xem các thành phần đã chuyển đổi thành số hợp lệ chưa
    if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hours) || isNaN(minutes)) {
        console.log("Ngày hoặc giờ đi không hợp lệ");
        return;
    }

    // Tạo đối tượng Date từ các thành phần của ngày và giờ đi
    const departureDateTime = new Date(year, month - 1, day, hours, minutes);

    // Thêm số phút di chuyển vào ngày và giờ đi
    const arrivalDateTime = new Date(departureDateTime.getTime() + durationInMinutes * 60000);

    // Lấy ngày đến nơi
    const arrivalDate = `${arrivalDateTime.getDate()}/${arrivalDateTime.getMonth() + 1}/${arrivalDateTime.getFullYear()}`;

    // Lấy giờ đến nơi
    const arrivalTime = `${arrivalDateTime.getHours()}:${arrivalDateTime.getMinutes().toString().padStart(2, '0')}`;
    return { arrivalDate, arrivalTime };
}

const validateNumber = (_, value) => {
    const numberPattern = /^\d+$/;
    if (!numberPattern.test(value)) {
        return Promise.reject('Vui lòng nhập số!');
    }
    return Promise.resolve();
};

const ModalUpdateGoodsOrder = (props) => {
    const { trip, goodsOrder, isUpdateGoods, setIsUpdateGoods, handleRefetchGoodsOrder } = props
    const [form] = Form.useForm();
    const formRef = useRef(null);
    const user = useSelector((state) => state.user)
    const [listPickUpPoint, setListPickUpPoint] = useState([])
    const [listDropOffPoint, setListDropOffPoint] = useState([])
    const [pickUpPoint, setPickUpPoint] = useState();
    const [dropOffPoint, setDropOffPoint] = useState();

    useEffect(() => {
        form.setFieldsValue({
            senderName: goodsOrder.nameSender,
            senderEmail: goodsOrder.emailSender,
            senderPhone: goodsOrder.phoneSender,
            receiverName: goodsOrder.nameReceiver,
            receiverEmail: goodsOrder.emailReceiver,
            receiverPhone: goodsOrder.phoneReceiver,

            sendLocation: listPickUpPoint?.find(item => item.place === goodsOrder.sendPlace)?.id,
            noteSend: goodsOrder.noteSend,
            receiveLocation: listDropOffPoint?.find(item => item.place === goodsOrder.receivePlace)?.id,
            noteReceive: goodsOrder.noteReceive,

            goodsName: goodsOrder.goodsName,
            goodsDescription: goodsOrder.goodsDescription,
            price: goodsOrder.price,
            isPaid: goodsOrder.isPaid,
            paymentMethod: goodsOrder.paymentMethod
        })

        console.log('goodsOrder', goodsOrder);
    }, [goodsOrder, listDropOffPoint, listPickUpPoint])

    const onCancel = () => {
        form.resetFields()
        // handleCancel()
        setIsUpdateGoods(false)
    }


    // Get List Stop Point
    const { data: dataStopPoint, refetch } = useQuery(
        {
            queryKey: [`listStopPoint${trip?.routeId.id}`],
            queryFn: () => getStopPointsByBusRoute(trip?.routeId.id),
        });

    useEffect(() => {
        setListPickUpPoint(dataStopPoint?.data?.listPickUpPoint.sort((a, b) => a.timeFromStart - b.timeFromStart))
        setListDropOffPoint(dataStopPoint?.data?.listDropOffPoint.sort((a, b) => a.timeFromStart - b.timeFromStart))
    }, [dataStopPoint])

    const mutation = useMutation(
        {
            mutationFn: (data) => {
                return updateGoodsOrder(goodsOrder.id, user?.access_token, data)
            },
            onSuccess: (data) => {
                handleRefetchGoodsOrder()
                successMes(data?.message)
                setIsUpdateGoods(false)
            },
            onError: (data) => {
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
        } else {
            data = { ...data, paymentMethod: '' }
        }
        // console.log('data', data);
        mutation.mutate(data)

    };

    return (
        <div>
            <Modal
                title={<h3>Thêm hàng hóa</h3>}
                open={isUpdateGoods}
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
                                            {calculateTime(trip?.departureTime, item.timeFromStart)} {item.place}
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
                                            {calculateTime(trip?.departureTime, item.timeFromStart)} {item.place}
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

export default ModalUpdateGoodsOrder