import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Input, InputNumber, Modal, Radio, Row, Select, TimePicker } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { updateSchedule } from '../../../services/ScheduleService';
import { errorMes, loadingMes, successMes } from '../../Message/Message';
import { Option } from 'antd/es/mentions';
import dayjs from 'dayjs';

const daysOfWeekOptions = [
    { label: 'Thứ 2', value: 'Monday' },
    { label: 'Thứ 3', value: 'Tuesday' },
    { label: 'Thứ 4', value: 'Wednesday' },
    { label: 'Thứ 5', value: 'Thursday' },
    { label: 'Thứ 6', value: 'Friday' },
    { label: 'Thứ 7', value: 'Saturday' },
    { label: 'Chủ nhật', value: 'Sunday' },
];
const ModalUpdateSchedule = (props) => {
    const { schedule, isUpdateSchedule, handleCancel, refetch, listBus, listDriver, filterOption, dataBuss } = props
    const [form] = Form.useForm();
    const formRef = useRef(null);
    const user = useSelector((state) => state.user)

    const [departureTime, setDepartureTime] = useState()
    const [scheduleType, setScheduleType] = useState('');

    const onCancel = () => {
        handleCancel()
        form.resetFields()
    }

    useEffect(() => {
        setScheduleType(schedule?.scheduleType)
        setDepartureTime(schedule?.departureTime)
        form.setFieldsValue({
            bus: listBus?.find(item => item?.value === schedule?.busId._id)?.value,
            driver: listDriver?.find(item => item?.value === schedule?.driverId._id)?.value,
            scheduleType: schedule?.scheduleType,
            periodic: schedule?.scheduleType === 'periodic' ? schedule?.inforSchedule : '',
            daysOfWeek: schedule?.scheduleType === 'weekly_days' ? schedule?.inforSchedule.split(', ') : '',
            time: dayjs(schedule?.departureTime, 'HH:mm'),
            timeAllowCancel: schedule?.timeAllowCancel,
            ticketPrice: schedule?.ticketPrice,
            paymentRequire: schedule?.paymentRequire ? 'true' : 'false',
            prebooking: schedule?.prebooking ? 'true' : 'false',
        })
    }, [schedule])

    const mutation = useMutation({
        mutationFn: async (data) => {
            const { id, access_token, ...rest } = data;
            return await updateSchedule(id, access_token, rest);
        },
        onSuccess: (data) => {
            console.log(data);
            successMes(data.message)
            refetch()
            handleCancel()
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    });

    const onFinish = (values) => {
        mutation.mutate({
            id: schedule?._id,
            access_token: user?.access_token,
            busOwnerId: JSON.parse(localStorage.getItem('bus_owner_id')),
            busId: values?.bus,
            driverId: values?.driver,
            departureTime: departureTime,
            paymentRequire: values?.paymentRequire === 'true' ? true : false,
            prebooking: values?.prebooking === 'true' ? true : false,
            ticketPrice: values?.ticketPrice,
            timeAllowCancel: values?.timeAllowCancel,
            scheduleType: values?.scheduleType,
            inforSchedule: values?.scheduleType === 'periodic' ? values?.periodic : (values?.scheduleType === 'weekly_days' ? values?.daysOfWeek.join(', ') : '')

        })
        loadingMes()
    }

    const onchangeDepartureTime = (time, timeString) => {
        setDepartureTime(timeString)
    }
    return (
        <div>
            <Modal
                title={<h3>Cập nhật lịch trình</h3>}
                open={isUpdateSchedule}
                okText='Cập nhật'
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
                                <Option value="daily">Hàng ngày</Option>
                                <Option value="periodic">Định kỳ</Option>
                                <Option value="weekly_days">Ngày trong tuần</Option>
                            </Select>
                        </Form.Item>

                        {scheduleType === 'periodic' && (
                            <Form.Item
                                name="periodic"
                                label="Số ngày định kỳ"
                                rules={[{ required: true, message: 'Số ngày không được bỏ trống!' }]}
                            >
                                <Input type='number'></Input>
                            </Form.Item>
                        )}

                        {scheduleType === 'weekly_days' && (
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
                            name="timeAllowCancel"
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

export default ModalUpdateSchedule