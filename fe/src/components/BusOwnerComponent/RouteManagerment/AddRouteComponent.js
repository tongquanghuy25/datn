import React, { useState, useEffect, useRef } from 'react'
import { Table, Select, Modal, Form, InputNumber, Input, TimePicker, Button } from 'antd'
import { ArrowRightOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllProvince, getDistrictByProvince } from '../../../services/PlaceService';
import ModalAddStopPoint from './ModalAddStopPoint';
import { createRoute } from '../../../services/RouteService';
import { useSelector } from 'react-redux';
import { errorMes, loadingMes, successMes } from '../../Message/Message';
import { getVnCurrency } from '../../../utils';

const AddRouteComponent = (props) => {
    const { refetch, closeCreateRoute } = props
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
                    <span style={{ color: '#2ec429  ', fontWeight: '500' }}>
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
                const num = record ? getVnCurrency(record) : null;
                return <span style={{ color: '#2196F3   ', fontWeight: '500' }}>
                    {num}
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
                    <DeleteOutlined onClick={() => deleteStopPointFromList(record)} style={{ color: 'red' }} />
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
    const [journeyTime, setJourneyTime] = useState('');

    const [isCreatePoint, setIsCreatePoint] = useState(false)
    const [isPickUpPoint, setIsPickUpPoint] = useState(true)
    const [listPickUpPoint, setListPickUpPoint] = useState([])
    const [listDropOffPoint, setListDropOffPoint] = useState([])

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

    //Select District Start and Province Start
    const mutationStart = useMutation({
        mutationFn: async (data) => {
            const { provinceId } = data;
            return await getDistrictByProvince(provinceId);
        }
    });

    const { data: dataDistrictStart } = mutationStart

    useEffect(() => {
        queryClient.setQueryData(provinceStart, dataDistrictStart?.data);
        const listData = dataDistrictStart?.data?.map((district) => ({
            value: district._id,
            label: district.name,
        }));
        setListDistrictStart(listData)
    }, [dataDistrictStart])

    const getListDistrictStart = (provinceId) => {
        const cacheDistrict = queryClient.getQueryData(listProvince[provinceId - 1].label)

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


    //Select Province End And District End
    const mutationEnd = useMutation({
        mutationFn: async (data) => {
            const { provinceId } = data;
            return await getDistrictByProvince(provinceId);
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
        const cahceDistrict = queryClient.getQueryData(listProvince[provinceId - 1].label)
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
    //Table

    const addDataToListPoint = (data) => {
        if (isPickUpPoint) {
            setListPickUpPoint([...listPickUpPoint, data].sort((a, b) => a.timeFromStart - b.timeFromStart))

        }
        else setListDropOffPoint([...listDropOffPoint, data].sort((a, b) => a.timeFromStart - b.timeFromStart))
    }

    const deleteStopPointFromList = (record) => {
        if (isPickUpPoint) {
            setListPickUpPoint(listPickUpPoint.filter(point => point !== record))
        } else setListDropOffPoint(listDropOffPoint.filter(point => point !== record))
    }

    const handleCancel = () => {
        setIsCreatePoint(false)
    }

    // Create Route
    const mutation = useMutation({
        mutationFn: async (data) => {
            const { access_token, ...rest } = data;
            return await createRoute(rest, access_token);
        },
        onSuccess: (data) => {
            successMes(data.message)
            closeCreateRoute()
            refetch()

        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    });

    const handleCreateRoute = () => {
        const placeStart = listPickUpPoint.length > 0 && listPickUpPoint[0].place
        const placeEnd = listDropOffPoint.length > 0 && listDropOffPoint[listDropOffPoint.length - 1].place
        console.log('locationStart', placeStart, placeEnd);
        mutation.mutate({
            access_token: user?.access_token,
            busOwnerId: JSON.parse(localStorage.getItem('bus_owner_id')),
            districtStart,
            provinceStart,
            districtEnd,
            provinceEnd,
            journeyTime,
            placeStart,
            placeEnd,
            listPickUpPoint,
            listDropOffPoint
        })
    }

    return (
        <div>
            <div >
                <div style={{ display: 'flex', justifyContent: 'center', fontSize: '30px', fontWeight: '700', marginBottom: '10px' }}>Thêm tuyến đường</div>
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
                        />
                        <Select
                            style={{ minWidth: '150px' }}
                            showSearch
                            placeholder="Chọn huyện"
                            onChange={onChangeDistrictStart}
                            filterOption={filterOption}
                            options={listDistrictStart}
                        />
                    </div>
                    {/* <ArrowRightOutlined></ArrowRightOutlined> */}
                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <div style={{ marginBottom: '5px', fontWeight: '500' }}>Thời gian di chuyển</div>
                        <TimePicker placeholder='Giờ phút' format='HH:mm' onChange={onchangeJourneyTime} />

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
                        />
                        <Select
                            style={{ minWidth: '150px' }}
                            showSearch
                            placeholder="Chọn huyện"
                            onChange={onChangeDistrictEnd}
                            filterOption={filterOption}
                            options={listDistrictEnd}
                        />
                    </div>
                </div>
            </div>
            <div style={{ height: '77%' }}>
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
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <Button onClick={handleCreateRoute} type="primary" style={{ borderColor: '#52c41a' }}>
                        Xác nhận
                    </Button>
                </div>

            </div>
            <ModalAddStopPoint
                listProvince={listProvince}
                isCreatePoint={isCreatePoint}
                isPickUpPoint={isPickUpPoint}
                filterOption={filterOption}
                handleCancel={handleCancel}
                addDataToListPoint={addDataToListPoint}
            />


        </div>
    )
}

export default AddRouteComponent