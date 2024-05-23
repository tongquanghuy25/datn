import React, { useState, useEffect, useRef } from 'react'
import { Table, Select, Modal, Form, InputNumber, Input, TimePicker, Button, Popconfirm } from 'antd'
import { ArrowRightOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllProvince, getDistrictByProvince } from '../../../services/PlaceService';
import ModalAddStopPoint from './ModalAddStopPoint';
import { deleteRoute, deleteStopPoint, getStopPointsByBusRoute, updateRoute } from '../../../services/RouteService';
import { useSelector } from 'react-redux';
import { errorMes, loadingMes, successMes } from '../../Message/Message';
import dayjs from 'dayjs';
import { getVnCurrency } from '../../../utils';

const InforRouteComponent = (props) => {

    const { route, refetchListRoute } = props
    const user = useSelector((state) => state.user)
    const queryClient = useQueryClient();
    const column = [

        {
            title: "Tỉnh/Thành phố",
            dataIndex: 'province',
            key: 'province',


        },
        {
            title: "Quận/Huyện",
            dataIndex: 'district',
            key: 'district',
        },
        {
            title: "Địa điểm",
            dataIndex: 'place',
            key: 'place',
            width: 200,
        },
        {
            title: "Thời gian từ lúc bắt đầu",
            dataIndex: 'timeFromStart',
            key: 'timeFromStart',
            width: 120,
            render: (record) => {
                return (
                    <span style={{ color: '#9C27B0  ', fontWeight: '500' }}>
                        {parseInt(record / 60)}h  {parseInt(record % 60)}p
                    </span>
                )
            }
        },
        {
            title: "Phí phát sinh",
            dataIndex: 'extracost',
            key: 'extracost',
            width: 120,
            render: (record) => {
                const num = record ? getVnCurrency(record) : null
                return <span style={{ color: '#2ec429   ', fontWeight: '500' }}>
                    {num ? num : null}
                </span>
            }
        },
        // {
        //     title: "Sửa",
        //     key: 'edit',
        //     width: 60,
        //     render: (record) => {
        //         return <>
        //             <EditOutlined onClick={() => onEditStopPoint(record)} style={{ color: 'green' }} />
        //         </>
        //     }
        // },
        {
            title: "Xóa",
            key: 'delete',
            width: 60,
            render: (record) => {
                return <>
                    <Popconfirm
                        title={`Bạn có chắc chắn muốn xóa điểm ${isPickUpPoint ? 'đón' : 'trả'}`}
                        // description={`Bạn có chắc chắn muốn xóa điểm ${isPickUpPoint ? 'đón' : 'trả'}`}
                        onConfirm={() => onDeleteStopPoint(record)}
                        // onCancel={cancel}
                        okText="Đồng ý"
                        cancelText="Hủy"
                    >

                        <DeleteOutlined style={{ color: 'red' }} />
                    </Popconfirm>
                </>
            }
        }

    ]

    const [listProvince, setListProvince] = useState([])
    const [listDistrictStart, setListDistrictStart] = useState([])
    const [listDistrictEnd, setListDistrictEnd] = useState([])
    const [provinceStart, setProvinceStart] = useState();
    const [provinceEnd, setProvinceEnd] = useState();
    const [districtStart, setDistrictStart] = useState();
    const [districtEnd, setDistrictEnd] = useState();
    const [journeyTime, setJourneyTime] = useState();

    const [isCreatePoint, setIsCreatePoint] = useState(false)
    const [isPickUpPoint, setIsPickUpPoint] = useState(true)
    const [listPickUpPoint, setListPickUpPoint] = useState([])
    const [listDropOffPoint, setListDropOffPoint] = useState([])
    const [isDeletingRoute, setIsDeletingRoute] = useState(false)


    useEffect(() => {
        setProvinceStart(route?.provinceStart)
        setProvinceEnd(route?.provinceEnd)
        setDistrictStart(route?.districtStart)
        setDistrictEnd(route?.districtEnd)
        const provinceStartId = listProvince?.find(item => item?.label === route?.provinceStart)
        if (provinceStartId) getListDistrictStart(provinceStartId?.value)
        const provinceEndId = listProvince?.find(item => item?.label === route?.provinceEnd)
        if (provinceEndId) getListDistrictEnd(parseInt(provinceEndId?.value))
        setJourneyTime(route?.journeyTime)
    }, [route])

    //Get All Province
    const { data } = useQuery(
        {
            queryKey: ['provinces'],
            queryFn: () => getAllProvince(),
            staleTime: Infinity
        });

    useEffect(() => {
        const listData = data?.data?.map((province) => ({
            value: province._id,
            label: province.name,
        }));
        setListProvince(listData);
    }, [data])

    //Select Province and District Start
    const mutationStart = useMutation({
        mutationFn: async (data) => {
            const { provinceId } = data;
            if (provinceId) return await getDistrictByProvince(provinceId);
        }
    });

    const { data: dataDistrictStart } = mutationStart

    useEffect(() => {
        queryClient.setQueryData(provinceStart, dataDistrictStart?.data);
        const listData1 = dataDistrictStart?.data?.map((district) => ({
            value: district._id,
            label: district.name,
        }));
        setListDistrictStart(listData1)
    }, [dataDistrictStart])

    const getListDistrictStart = (provinceId) => {
        const cacheDistrict = queryClient.getQueryData(listProvince[provinceId - 1]?.label)

        if (cacheDistrict?.length > 0) {
            const listData2 = cacheDistrict?.map((district) => ({
                value: district._id,
                label: district.name,
            }));
            setListDistrictStart(listData2)
        } else mutationStart.mutate({ provinceId })
    }

    const onChangeProvinceStart = (value) => {
        setProvinceStart(listProvince[value - 1].label)
        getListDistrictStart(value)
    };

    const onChangeDistrictStart = (value) => {
        setDistrictStart(listDistrictStart.find(item => item.value === value).label)
    }

    //Select Distric and Province End
    const mutationEnd = useMutation({
        mutationFn: async (data) => {
            const { provinceId } = data;
            if (provinceId) return await getDistrictByProvince(provinceId);
        }
    });

    const { data: dataDistrictEnd } = mutationEnd

    useEffect(() => {
        queryClient.setQueryData(provinceEnd, dataDistrictEnd?.data);
        const listData3 = dataDistrictEnd?.data?.map((district) => ({
            value: district._id,
            label: district.name,
        }));
        setListDistrictEnd(listData3)
    }, [dataDistrictEnd])

    const getListDistrictEnd = (provinceId) => {
        const cahceDistrict = queryClient.getQueryData(listProvince[provinceId - 1]?.label)
        if (cahceDistrict?.length > 0) {
            const listData4 = cahceDistrict?.map((district) => ({
                value: district._id,
                label: district.name,
            }));
            setListDistrictEnd(listData4)
        } else mutationEnd.mutate({ provinceId })
    }

    const onChangeProvinceEnd = (value) => {
        setProvinceEnd(listProvince[value - 1].label)
        getListDistrictEnd(value)
    };

    const onChangeDistrictEnd = (value) => {
        setDistrictEnd(listDistrictEnd.find(item => item.value === value).label)
    }
    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const onchangeJourneyTime = (time, timeString) => {
        setJourneyTime(timeString)
    }
    // Get List Stop Point
    const { data: dataStopPoint, refetch } = useQuery(
        {
            queryKey: [`listStopPoint${route?._id}`],
            queryFn: () => getStopPointsByBusRoute(route?._id),
        });

    useEffect(() => {
        setListPickUpPoint(dataStopPoint?.data?.listPickUpPoint)
        setListDropOffPoint(dataStopPoint?.data?.listDropOffPoint)
    }, [dataStopPoint])

    const handleCancel = () => {
        setIsCreatePoint(false)
    }

    const addDataToListPoint = (data) => {
        if (isPickUpPoint) setListPickUpPoint([...listPickUpPoint, data])
        else setListDropOffPoint([...listDropOffPoint, data])
    }

    const mutationUpdateRoute = useMutation({
        mutationFn: async (data) => {
            const { id, access_token, ...rest } = data;
            return await updateRoute(id, access_token, rest);
        },
        onSuccess: (data) => {
            console.log(data);
            successMes(data?.message)
            refetchListRoute()
            setIsDeletingRoute(false)
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
            setIsDeletingRoute(false)
        }
    })


    const handleUpdateRoute = () => {
        const placeStart = listPickUpPoint.length > 0 && listPickUpPoint[0].place
        const placeEnd = listDropOffPoint.length > 0 && listDropOffPoint[listDropOffPoint.length - 1].place
        console.log(placeStart, placeEnd);
        mutationUpdateRoute.mutate({ id: route._id, districtStart, provinceStart, districtEnd, provinceEnd, journeyTime, placeStart, placeEnd, access_token: user?.access_token })
    }

    const mutationDeleteRoute = useMutation({
        mutationFn: async (data) => {
            const { id, access_token } = data;
            return await deleteRoute(id, access_token);
        },
        onSuccess: (data) => {
            successMes(data?.message)
            refetchListRoute()
            setIsDeletingRoute(false)
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
            setIsDeletingRoute(false)
        }
    })

    const handleDeleteRoute = () => {
        mutationDeleteRoute.mutate({ id: route._id, access_token: user?.access_token })
    }


    const mutationDeleteStopPoint = useMutation({
        mutationFn: async (data) => {
            const { id, access_token } = data;
            return await deleteStopPoint(id, access_token);
        },
        onSuccess: (data) => {
            successMes(data?.message)
            refetch()
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    })

    const onDeleteStopPoint = (record) => {
        mutationDeleteStopPoint.mutate({ id: record?.id, access_token: user?.access_token })
    }

    return (
        <div style={{ height: '100%' }}>
            <div style={{ height: '18%' }}>
                <div style={{ display: 'flex', justifyContent: 'center', fontSize: '30px', fontWeight: '700', marginBottom: '10px' }}>Cập nhật thông tin tuyến đường</div>
                <div style={{ display: 'flex', justifyContent: 'space-around', borderBottom: '1px solid #cccccc', paddingBottom: '10px' }}>
                    <div>
                        <div style={{ marginBottom: '5px', fontWeight: '500' }}>Chọn nơi xuất phát</div>
                        <Select
                            style={{ minWidth: '150px', marginRight: '10px' }}
                            showSearch
                            placeholder="Chọn tỉnh"
                            onChange={onChangeProvinceStart}
                            filterOption={filterOption}
                            options={listProvince}
                            value={provinceStart}
                        />
                        <Select
                            style={{ minWidth: '150px' }}
                            showSearch
                            placeholder="Chọn huyện"
                            onChange={onChangeDistrictStart}
                            filterOption={filterOption}
                            options={listDistrictStart}
                            value={districtStart}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <div style={{ marginBottom: '5px', fontWeight: '500' }}>Thời gian di chuyển</div>
                        <TimePicker placeholder='Giờ phút' value={dayjs(journeyTime, 'HH:mm')} format='HH:mm' onChange={onchangeJourneyTime} />

                    </div>
                    <div>
                        <div style={{ marginBottom: '5px', fontWeight: '500' }}>Chọn nơi đến</div>
                        <Select
                            style={{ minWidth: '150px', marginRight: '10px' }}
                            showSearch
                            placeholder="Chọn tỉnh"
                            onChange={onChangeProvinceEnd}
                            filterOption={filterOption}
                            options={listProvince}
                            value={provinceEnd}
                        />
                        <Select
                            style={{ minWidth: '150px' }}
                            showSearch
                            placeholder="Chọn huyện"
                            onChange={onChangeDistrictEnd}
                            filterOption={filterOption}
                            options={listDistrictEnd}
                            value={districtEnd}
                        />
                    </div>
                </div>
            </div>
            <div style={{ height: '75%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <Button onClick={() => setIsPickUpPoint(true)} style={{ backgroundColor: isPickUpPoint ? '#abe0c9' : null, width: '200px', marginTop: '20px' }}>
                            Điểm đón
                        </Button>
                        <Button onClick={() => setIsPickUpPoint(false)} style={{ backgroundColor: !isPickUpPoint ? '#abe0c9' : null, width: '200px', marginTop: '20px' }}>
                            Điểm trả
                        </Button>
                    </div>
                    <Button onClick={() => setIsCreatePoint(true)} type="primary" icon={<PlusOutlined />} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', marginTop: '20px' }}>
                        Thêm điểm {isPickUpPoint ? 'đón' : 'trả'}
                    </Button>
                </div>
                <Table
                    rowKey="_id"
                    pagination={false}
                    dataSource={isPickUpPoint ? listPickUpPoint : listDropOffPoint}
                    columns={column}
                    scroll={{
                        y: 350,
                    }}
                ></Table>


            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <Button onClick={() => { handleUpdateRoute() }} type="primary" style={{ marginRight: '20px' }}>
                    Xác nhận sửa
                </Button>
                <Button danger onClick={() => { setIsDeletingRoute(true) }} type="primary" >
                    Xóa tuyến đường
                </Button>
            </div>
            <ModalAddStopPoint
                listProvince={listProvince}
                isCreatePoint={isCreatePoint}
                isPickUpPoint={isPickUpPoint}
                filterOption={filterOption}
                handleCancel={handleCancel}
                addDataToListPoint={addDataToListPoint}
                route={route}
                refetch={refetch}
            />

            <Modal
                title="Xác nhận xóa tuyến đường"
                open={isDeletingRoute}
                okText='Xác nhận'
                onOk={() => handleDeleteRoute()}
                cancelText='Hủy'
                onCancel={() => { setIsDeletingRoute(false) }}
            >
                <div style={{ color: 'red' }}>! Lưu ý: Các chuyến sắp tới của tuyến xe này sẽ bị xóa. Bạn cần kiểm tra lại.</div>
            </Modal>



        </div>
    )
}

export default InforRouteComponent