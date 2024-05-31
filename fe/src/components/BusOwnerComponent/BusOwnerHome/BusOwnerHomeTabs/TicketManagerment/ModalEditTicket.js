import { Col, Form, Input, Modal, Radio, Row, Select, } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@tanstack/react-query';
import { errorMes, loadingMes, successMes } from '../../../../Message/Message';
import { Option } from 'antd/es/mentions';
import { getStopPointsByBusRoute } from '../../../../../services/RouteService';
import { createGoodsOrder, createTicketOrder, updateTicketOrder } from '../../../../../services/OrderService';
import { getVnCurrency } from '../../../../../utils';


function calculateTime(startTime, minutes) {
    const [startHour] = startTime?.split('giờ')?.map(str => parseInt(str.trim()));
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


const ModalEditTicket = (props) => {
    const { trip, ticket, isEditTicket, setIsEditTicket, handleRefretch } = props
    const [form] = Form.useForm();
    const formRef = useRef(null);
    const user = useSelector((state) => state.user)
    const [listPickUpPoint, setListPickUpPoint] = useState([])
    const [listDropOffPoint, setListDropOffPoint] = useState([])
    const [pickUpPoint, setPickUpPoint] = useState();
    const [dropOffPoint, setDropOffPoint] = useState();
    const [totalPrice, setTotalPricet] = useState(0);

    useEffect(() => {
        setTotalPricet(ticket?.totalPrice)
        const pickUp = listPickUpPoint?.find(item => item.place === ticket?.pickUp)
        const dropOff = listDropOffPoint?.find(item => item.place === ticket?.dropOff)
        setPickUpPoint(pickUp)
        setDropOffPoint(dropOff)

        form.setFieldsValue({
            name: ticket?.name,
            email: ticket?.email,
            phone: ticket?.phone,
            pickUpPoint: pickUp?.id,
            notePickUp: ticket?.notePickUp,
            dropOffPoint: dropOff?.id,
            noteDropOff: ticket?.noteDropOff,
            isPaid: ticket?.isPaid
        })

    }, [isEditTicket, listPickUpPoint, listDropOffPoint])

    const onCancel = () => {
        form.resetFields()
        setIsEditTicket(false)
        setPickUpPoint()
        setDropOffPoint()
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
                const { id, access_token, dataUpdate } = data
                return updateTicketOrder(id, access_token, dataUpdate)
            },
            onSuccess: (data) => {
                handleRefretch()
                onCancel()
                successMes('Sửa đơn vé thành công!')
            },
            onError: (data) => {
                errorMes(data?.response?.data?.message)
            }
        }
    )
    const handleFinish = (values) => {
        const { arrivalDate, arrivalTime } = calculateArrivalDateAndTime(trip?.departureDate, trip?.departureTime, pickUpPoint.timeFromStart)
        const { arrivalDate: endDate, arrivalTime: endTime } = calculateArrivalDateAndTime(trip?.departureDate, trip?.departureTime, dropOffPoint.timeFromStart)

        const dataUpdate = {
            name: values.name,
            email: values.email,
            phone: values.phone,

            pickUp: pickUpPoint.place,
            notePickUp: values.notePickUp,
            timePickUp: arrivalTime,
            datePickUp: arrivalDate,

            dropOff: dropOffPoint.place,
            noteDropOff: values.noteDropOff,
            timeDropOff: endTime,
            dateDropOff: endDate,

            seats: ticket?.seats,
            seatCount: ticket?.seatCount,

            ticketPrice: trip?.ticketPrice,
            extraCosts: ((pickUpPoint?.extracost || 0) + (dropOffPoint?.extracost || 0)),
            totalPrice,

            isPaid: values?.isPaid,
            payee: values?.isPaid ? user?.id : null,
        }
        mutation.mutate({ id: ticket?.id, access_token: user?.access_token, dataUpdate })
    };


    return (
        <div>
            <Modal
                title={<h3>Thêm vé</h3>}
                open={isEditTicket}
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
                                            {calculateTime(trip?.departureTime, item.timeFromStart)} {item.place} {item?.extracost ? `( Phụ phí ${getVnCurrency(item?.extracost)} )` : ''}
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
                                            {calculateTime(trip?.departureTime, item.timeFromStart)} {item.place} {item?.extracost ? `( Phụ phí ${getVnCurrency(item?.extracost)} )` : ''}
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

                            <div>
                                <span>Vị Trí Ghế : <b>{ticket?.seats.join(', ')}</b></span>

                            </div>
                            <span>Số Lượng Ghế : <b>{ticket?.seatCount}</b></span>
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

export default ModalEditTicket