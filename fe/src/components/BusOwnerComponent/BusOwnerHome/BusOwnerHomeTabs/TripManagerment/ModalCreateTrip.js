import { DatePicker, Form, Input, InputNumber, Modal, Radio, Row, Select, TimePicker } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { getRouteByBusOwner } from '../../../../../services/RouteService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getBussByBusOwner } from '../../../../../services/BusService';
import { getDriversByBusOwner } from '../../../../../services/DriverService';
import dayjs from 'dayjs';
import { createTrip } from '../../../../../services/TripService';
import { errorMes, loadingMes, successMes } from '../../../../Message/Message';

const ModalCreateTrip = (props) => {
    const { handleCancel, isCreateTrip, refetch, listRoute, listBus, listDriver, dataRoutes, dataBuss, filterOption } = props
    const [form] = Form.useForm();
    const formRef = useRef(null);
    const user = useSelector((state) => state.user)


    const mutation = useMutation({
        mutationFn: async (data) => {
            const { access_token, ...rest } = data;
            console.log('datasđfsa', data);
            return await createTrip(access_token, rest);
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
            busId: values?.bus,
            routeId: values?.route,
            driverId: values?.driver,
            dates: values.dates?.map(item => item.format('YYYY-MM-DD')),
            departureTime: values.time.format('HH:mm'),
            totalSeats: totalSeats,
            paymentRequire: values?.paymentRequire === 'true' ? true : false,
            prebooking: values?.prebooking === 'true' ? true : false,
            ticketPrice: values?.ticketPrice,
            timeAlowCancel: values?.timeAlowCancel
        })
        loadingMes()
    }

    const onCancel = () => {
        form.resetFields()
        handleCancel()
    }


    return (
        <div>
            <Modal
                title={<h3>Thêm chuyến</h3>}
                open={isCreateTrip}
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
                                // onChange={onChangeProvince}
                                filterOption={filterOption}
                                options={listDriver}
                            />
                        </Form.Item>
                    </Row>

                    <Form.Item
                        name="dates"
                        label="Chọn ngày xuất phát"
                        rules={[
                            {
                                required: true,
                                message: "Tuyến đường không được bỏ trống !",
                            }
                        ]}
                    >
                        <DatePicker
                            multiple
                            format='DD/MM/YYYY'
                        // minDate={dayjs()}
                        // defaultValue={dayjs()}
                        // onChange={onChangeDate}
                        />
                    </Form.Item>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Form.Item
                            name="time"
                            label="Chọn giờ xuất phát"
                            rules={[
                                {
                                    required: true,
                                    message: "Tuyến đường không được bỏ trống !",
                                }
                            ]}
                        >
                            <TimePicker
                                placeholder="Chọn giờ phút"
                                format='HH:mm'
                            />
                        </Form.Item>
                        <Form.Item
                            name="timeAlowCancel"
                            label="Số giờ chon phép hủy trước khi chạy"
                            rules={[
                                {
                                    required: true,
                                    message: "Không được bỏ trống !",
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
                                message: "Tuyến đường không được bỏ trống !",
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
                                <Radio value="fale">Không</Radio>
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
                                <Radio value="fale">Không</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </div>

                </Form>
            </Modal>
        </div>
    )
}

export default ModalCreateTrip