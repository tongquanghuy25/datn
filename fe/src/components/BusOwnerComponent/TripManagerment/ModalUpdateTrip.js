import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Modal, Select } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { updateTrip } from '../../../services/TripService';
import { errorMes, successMes } from '../../Message/Message';
const ModalUpdateTrip = (props) => {
    const { trip, isUpdateTrip, handleCancel, refetch, listBus, listDriver, filterOption } = props
    const [form] = Form.useForm();
    const formRef = useRef(null);
    const user = useSelector((state) => state.user)

    const [driver, setDriver] = useState()
    const [bus, setBus] = useState()
    const [status, setStatus] = useState()

    const onCancel = () => {
        handleCancel()
        form.resetFields()
    }

    useEffect(() => {
        setDriver(trip?.driverId?._id)
        setBus(trip?.busId?._id)
        setStatus(trip?.status)
    }, [trip])

    const onChangeBus = (select) => {
        setBus(select)
    }
    const onChangeDriver = (select) => {
        setDriver(select)
    }

    const onChangeStatus = (select) => {
        setStatus(select)
    }

    const mutation = useMutation({
        mutationFn: async (data) => {
            const { id, access_token, ...rest } = data;
            return await updateTrip(id, access_token, rest);
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

    const handleUpdate = () => {
        mutation.mutate({ id: trip?._id, access_token: user?.access_token, busId: bus, driverId: driver, status: status })
    }
    return (
        <div>
            <Modal
                title={<h3>Cập nhật chuyến</h3>}
                open={isUpdateTrip}
                okText='Cập nhật'
                onOk={() => {
                    handleUpdate()
                }}
                cancelText='Hủy'
                onCancel={onCancel}
            >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>Xe</span>
                    <Select
                        style={{ minWidth: '200px', marginBottom: '20px' }}
                        showSearch
                        placeholder="Chọn xe"
                        onChange={onChangeBus}
                        filterOption={filterOption}
                        options={listBus}
                        value={listBus?.find(item => item?.value === bus)?.label}
                    />

                    <span>Tài xế</span>

                    <Select
                        style={{ minWidth: '200px', marginBottom: '20px' }}
                        showSearch
                        placeholder="Chọn tài xế"
                        onChange={onChangeDriver}
                        filterOption={filterOption}
                        options={listDriver}
                        value={listDriver?.find(item => driver === item.value)?.label}
                    />

                    <span>Trạng thái</span>
                    <Select
                        style={{ minWidth: '200px', marginBottom: '20px' }}
                        onChange={onChangeStatus}
                        options={[
                            {
                                value: 'Chưa khởi hành',
                                label: 'Chưa khởi hành'
                            },
                            {
                                value: 'Đã khởi hành',
                                label: 'Đã khởi hành'
                            },
                            {
                                value: 'Đã kết thúc',
                                label: 'Đã kết thúc'
                            },
                        ]}
                        value={status}
                    />
                </div>


                {/* <Form
                    ref={formRef}
                    layout="vertical"
                    form={form}
                    onFinish={onFinish}
                >


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
                            style={{ minWidth: '150px', marginRight: '10px' }}
                            showSearch
                            placeholder="Chọn tài xế"
                            // onChange={onChangeProvince}
                            filterOption={filterOption}
                            options={listDriver}
                            value={driver}
                        />


                    </Form.Item>
                </Form> */}
            </Modal>
        </div>
    )
}

export default ModalUpdateTrip