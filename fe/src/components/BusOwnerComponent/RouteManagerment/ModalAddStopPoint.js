import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AutoComplete, Form, Input, InputNumber, Modal, Select, TimePicker } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { getDistrictByProvince } from '../../../services/PlaceService';
import { addLocation, addStopPoint, getAllPlace } from '../../../services/RouteService';
import { useSelector } from 'react-redux';
import { errorMes, loadingMes, successMes } from '../../Message/Message';

const ModalAddStopPoint = (props) => {
    const { listProvince, isCreatePoint, isPickUpPoint, handleCancel, filterOption, addDataToListPoint, route, refetch } = props

    const [form] = Form.useForm();
    const formRef = useRef(null);
    const queryClient = useQueryClient();
    const user = useSelector((state) => state.user)

    const [listDistrict, setListDistrict] = useState([])
    const [listPlace, setListPlace] = useState([])
    const [options, setOptions] = useState([]);
    const [district, setDistrict] = useState()
    const [province, setProvince] = useState()
    const [place, setPlace] = useState()
    const [timeFromStart, setTimeFromStart] = useState()
    const [extracost, setExtraCost] = useState()

    const mutation = useMutation({
        mutationFn: async (data) => {
            const { provinceId } = data;
            return await getDistrictByProvince(provinceId);
        }
    });

    const { data: dataDistrict } = mutation

    useEffect(() => {
        queryClient.setQueryData(province, dataDistrict?.data);
        const listData = dataDistrict?.data?.map((district) => ({
            value: district._id,
            label: district.name,
        }));
        setListDistrict(listData)
    }, [dataDistrict])

    const getListDistrict = (provinceId) => {
        const cahceDistrict = queryClient.getQueryData(listProvince[provinceId - 1].label)
        if (cahceDistrict?.length > 0) {
            const listData4 = cahceDistrict?.map((district) => ({
                value: district._id,
                label: district.name,
            }));
            setListDistrict(listData4)
        } else mutation.mutate({ provinceId })
    }

    const onChangeProvince = (value) => {
        setProvince(listProvince[value - 1].label)
        getListDistrict(value)
    };

    const mutationGetListPlace = useMutation({
        mutationFn: async (data) => {
            const { province, district, access_token } = data;
            return await getAllPlace(access_token, province, district);
        },
        onSuccess: (data) => {
            setListPlace(data?.data)
            setOptions(data?.data.map(option => ({ value: option })));
        }
    });
    const onChangeDistrict = (value) => {
        const districtSelected = listDistrict.find(item => item.value === value).label
        setDistrict(districtSelected)
        mutationGetListPlace.mutate({ province, district: districtSelected, access_token: user?.access_token })

    }


    const mutationAddLocation = useMutation({
        mutationFn: async (data) => {
            const { access_token, ...rest } = data;
            return await addLocation(rest, access_token);
        },
        onSuccess: (data) => {
            formRef.current.resetFields(['place', 'extracost']);
            handleCancel()
            successMes(data.message)
            addDataToListPoint({
                locationId: data.data?._id,
                district: district,
                province: province,
                place: place,
                timeFromStart: timeFromStart,
                extracost: extracost
            });
        }
    });

    const mutationAddStopPoint = useMutation({
        mutationFn: async (data) => {
            const { access_token, ...rest } = data;
            return await addStopPoint(rest, access_token);
        },
        onSuccess: (data) => {
            formRef.current.resetFields(['place', 'extracost']);
            successMes(data.message)
            refetch()
            handleCancel()
        }
    });

    const onFinishCreate = (values) => {
        const time = parseInt(values.time?.hour()) * 60 + parseInt(values.time?.minute())
        setExtraCost(values.extracost)
        setTimeFromStart(time)
        setPlace(values.place)

        setTimeFromStart(time)
        if (route) {
            mutationAddStopPoint.mutate({
                routeId: route._id,
                district: district,
                province: province,
                place: values.place,
                timeFromStart: time,
                extracost: values.extracost,
                isPickUp: isPickUpPoint,
                access_token: user?.access_token
            })
        } else mutationAddLocation.mutate({
            district: district,
            province: province,
            place: values.place,
            access_token: user?.access_token
        })
    }
    //////////

    const handleSearch = (value) => {
        const filteredOptions = listPlace.filter(option =>
            option.toLowerCase().includes(value.toLowerCase())
        );
        setOptions(filteredOptions.map(option => ({ value: option })));
    };

    return (
        <div>
            <Modal
                title={isPickUpPoint ? <h3>Thêm điểm đón</h3> : <h3>Thêm điểm trả</h3>}
                open={isCreatePoint}
                okText='Xác nhận'
                onOk={() => {
                    formRef.current.submit()
                }}
                cancelText='Hủy'
                onCancel={handleCancel}

            >
                <Form
                    ref={formRef}
                    layout="vertical"
                    form={form}
                    onFinish={onFinishCreate}>
                    <Form.Item
                        name="province"
                        label="Tỉnh/Thành phố"
                        rules={[
                            {
                                required: true,
                                message: "Tỉnh không được bỏ trống !",
                            }
                        ]}
                    >
                        <Select
                            style={{ minWidth: '150px', marginRight: '10px' }}
                            showSearch
                            placeholder="Chọn tỉnh"
                            onChange={onChangeProvince}
                            filterOption={filterOption}
                            options={listProvince}
                        />
                    </Form.Item>
                    <Form.Item
                        name="district"
                        label="Quận/Huyện"
                        rules={[
                            {
                                required: true,
                                message: "Huyện không được bỏ trống !",
                            }
                        ]}
                    >
                        <Select
                            style={{ minWidth: '150px' }}
                            showSearch
                            placeholder="Chọn huyện"
                            onChange={onChangeDistrict}
                            filterOption={filterOption}
                            options={listDistrict}
                        />
                    </Form.Item>
                    <Form.Item
                        name="place"
                        label="Địa điểm chi tiết"
                        rules={[
                            {
                                required: true,
                                message: "Địa điểm không được bỏ trống !",
                            }
                        ]}

                    >
                        <AutoComplete
                            style={{ width: 200 }}
                            options={options}
                            onSearch={handleSearch}
                            placeholder="Chọn địa điểm"
                        />
                        {/* <Input /> */}
                    </Form.Item>
                    <Form.Item
                        name="time"
                        label="Thời gian từ lúc xuất phát"
                        rules={[
                            {
                                required: true,
                                message: "Thời gian không được bỏ trống !",
                            }
                        ]}
                    >
                        <TimePicker format='HH:mm' />
                    </Form.Item>

                    <Form.Item
                        name="extracost"
                        label="Chi phí phát sinh"

                    >
                        <Input type='number' suffix="VNĐ" style={{ width: '200px' }} />
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    )
}

export default ModalAddStopPoint