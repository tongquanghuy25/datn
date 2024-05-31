import { Form, Input, InputNumber, Modal, Radio, Row, Select, TimePicker } from 'antd'
import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { createSchedule } from '../../../services/ScheduleService';
import { errorMes, loadingMes, successMes } from '../../Message/Message';
import { Option } from 'antd/es/mentions';

const daysOfWeekOptions = [
    { label: 'Thứ 2', value: 'Monday' },
    { label: 'Thứ 3', value: 'Tuesday' },
    { label: 'Thứ 4', value: 'Wednesday' },
    { label: 'Thứ 5', value: 'Thursday' },
    { label: 'Thứ 6', value: 'Friday' },
    { label: 'Thứ 7', value: 'Saturday' },
    { label: 'Chủ nhật', value: 'Sunday' },
];

const ModalCreateSchedule = (props) => {
    const { handleCancel, isCreateSchedule, refetch, listRoute, listBus, listDriver, dataBuss, filterOption } = props
    console.log('listRoute, listBus, listDriver', listRoute, listBus, listDriver);
    const [form] = Form.useForm();
    const formRef = useRef(null);
    const user = useSelector((state) => state.user)
    const [departureTime, setDepartureTime] = useState()
    const [scheduleType, setScheduleType] = useState('');

    const mutation = useMutation({
        mutationFn: async (data) => {
            const { access_token, ...rest } = data;
            return await createSchedule(access_token, rest);
        },
        onSuccess: (data) => {
            successMes(data.message)
            refetch()
            handleCancel()

        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    });


    const onFinish = (values) => {
        const totalSeats = dataBuss?.data?.find(item => item.id === values?.bus)?.numberSeat
        mutation.mutate({
            access_token: user?.access_token,
            busOwnerId: JSON.parse(localStorage.getItem('bus_owner_id')),
            routeId: values?.route,
            busId: values?.bus,
            driverId: values?.driver,
            departureTime: departureTime,
            paymentRequire: values?.paymentRequire === 'true' ? true : false,
            prebooking: values?.prebooking === 'true' ? true : false,
            ticketPrice: values?.ticketPrice,
            totalSeats: totalSeats,
            timeAlowCancel: values?.timeAlowCancel,
            scheduleType: values?.scheduleType,
            inforSchedule: values?.scheduleType === 'Periodic' ? values?.periodic : (values?.scheduleType === 'WeeklyDays' ? values?.daysOfWeek : '')

        })
        loadingMes()
    }

    const onCancel = () => {
        form.resetFields()
        handleCancel()
    }

    const onchangeDepartureTime = (time, timeString) => {
        setDepartureTime(timeString)
    }
    return (
        <div>
            <Modal
                title={<h3>Thêm lịch trình</h3>}
                open={isCreateSchedule}
                okText='Xác nhận'
                onOk={() => {
                    formRef.current.submit()
                }}
                cancelText='Hủy'
                onCancel={onCancel}
            >
                <Form
                    ref={formRef}
                    layout="vertical"
                    form={form}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="route"
                        label="Tuyến đường"
                        rules={[
                            {
                                required: true,
                                message: "Tuyến đường không được bỏ trống !",
                            }
                        ]}
                    >
                        <Select
                            style={{ minWidth: '150px', marginRight: '10px' }}
                            showSearch
                            placeholder="Chọn tuyến đường"
                            // onChange={onChangeProvince}
                            filterOption={filterOption}
                            options={listRoute}
                        />
                    </Form.Item>

                    <Row justify={'space-between'}>
                        <Form.Item
                            name="bus"
                            label="Xe"
                        >
                            <Select
                                style={{ minWidth: '150px', marginRight: '10px' }}
                                showSearch
                                placeholder="Chọn xe"
                                // onChange={onChangeProvince}
                                filterOption={filterOption}
                                options={listBus}
                            />
                        </Form.Item>

                        <Form.Item
                            name="driver"
                            label="Tài xế"
                        >
                            <Select
                                style={{ minWidth: '200px', marginRight: '10px' }}
                                showSearch
                                placeholder="Chọn tài xế"
                                filterOption={filterOption}
                                options={listDriver}
                            />
                        </Form.Item>
                    </Row>

                    <Row>
                        <Form.Item name="scheduleType" label="Loại lịch trình" rules={[{ required: true }]}>
                            <Select onChange={value => { setScheduleType(value) }} style={{ width: '160px', marginRight: '50px' }}>
                                <Option value="Daily">Hàng ngày</Option>
                                <Option value="Periodic">Định kỳ</Option>
                                <Option value="WeeklyDays">Ngày trong tuần</Option>
                            </Select>
                        </Form.Item>

                        {scheduleType === 'Deriodic' && (
                            <Form.Item
                                name="periodic"
                                label="Số ngày định kỳ"
                                rules={[{ required: true, message: 'Số ngày không được bỏ trống!' }]}
                            >
                                <Input type='number'></Input>
                            </Form.Item>
                        )}

                        {scheduleType === 'WeeklyDays' && (
                            <Form.Item
                                name="daysOfWeek"
                                label="Chọn ngày trong tuần"
                                rules={[{ required: true, message: 'Vui lòng chọn ít nhất một ngày' }]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Chọn ngày"
                                    options={daysOfWeekOptions}
                                    style={{ maxWidth: '240px' }}
                                />
                            </Form.Item>
                        )}
                    </Row>



                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Form.Item
                            name="time"
                            label="Chọn giờ xuất phát"
                            rules={[
                                {
                                    required: true,
                                    message: "Giờ xuất phát không được bỏ trống !",
                                }
                            ]}
                        >
                            <TimePicker
                                placeholder="Chọn giờ phút"
                                format='HH:mm'
                                onChange={onchangeDepartureTime} />
                        </Form.Item>
                        <Form.Item
                            name="timeAlowCancel"
                            label="Giờ cho phép hủy vé trước khi chạy"
                            rules={[
                                {
                                    required: true,
                                    message: "Giờ cho phép hủy vé không được bỏ trống !",
                                }
                            ]}
                        >
                            <Input type='number' style={{ width: '150px' }} />
                        </Form.Item>


                    </div>

                    <Form.Item
                        name="ticketPrice"
                        label="Giá vé"
                        rules={[
                            {
                                required: true,
                                message: "Giá vé không được bỏ trống !",
                            }
                        ]}
                    >
                        <Input type='number' suffix="VNĐ" style={{ width: '200px' }} />
                    </Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                        <Form.Item
                            name="paymentRequire"
                            label="Yêu cầu thanh toán trước"
                            rules={[
                                {
                                    required: true,
                                    message: "Không được bỏ trống !",
                                }
                            ]}>
                            <Radio.Group >
                                <Radio value="true">Có</Radio>
                                <Radio value="false">Không</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            name="prebooking"
                            label="Cho phép chọn ghế"
                            style={{ marginRight: '40px' }}
                            rules={[
                                {
                                    required: true,
                                    message: "Không được bỏ trống !",
                                }
                            ]}>
                            <Radio.Group >
                                <Radio value="true">Có</Radio>
                                <Radio value="false">Không</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </div>

                </Form>
            </Modal>
        </div>
    )
}

export default ModalCreateSchedule