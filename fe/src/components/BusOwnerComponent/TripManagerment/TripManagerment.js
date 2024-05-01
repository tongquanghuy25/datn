import React, { useEffect, useState } from 'react'
import { Button, DatePicker, Input, Popconfirm, Row, Table } from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined, ProfileOutlined } from '@ant-design/icons';
import ModalCreateTrip from './ModalCreateTrip';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteTrip, getTripsByBusOwner } from '../../../services/TripService';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { destroyMes, errorMes, loadingMes, successMes } from '../../Message/Message';
import ModalUpdateTrip from './ModalUpdateTrip';
import { getBussByBusOwner } from '../../../services/BusService';
import { getDriversByBusOwner } from '../../../services/DriverService';
import { getRouteByBusOwner } from '../../../services/RouteService';

const TripManagerment = () => {


    const column = [

        {
            title: "Tuyến đường",
            dataIndex: 'routeId',
            key: 'route',
            width: 400,
            align: 'center',
            render: (routeId) => `${routeId.districtStart}-${routeId.provinceStart} -> ${routeId.districtEnd}-${routeId.provinceEnd}`

        },
        {
            title: "Xe",
            dataIndex: 'busId',
            key: 'bus',
            width: 120,
            align: 'center',
            render: (busId) => busId?.licensePlate
        },
        {
            title: "Tài xế",
            dataIndex: 'driverId',
            key: 'driver',
            align: 'center',
            render: (driverId) => driverId?.userId?.name
        },
        {
            title: "Giờ xuất phát",
            dataIndex: 'departureTime',
            key: 'departureTime',
            width: 120,
            align: 'center',
            render: (departureTime) => {
                var timeParts = departureTime.split(":");
                var hours = parseInt(timeParts[0], 10);
                var minutes = parseInt(timeParts[1], 10);
                return `${hours} giờ ${minutes < 10 ? `0${minutes}` : minutes}`
            }
        },
        {
            title: "Trạng thái",
            key: 'status',
            align: 'center',
            width: 150,
            render: (record) => {
                if (record?.status === 'Đã kết thúc') return <div style={{ backgroundColor: '#4CAF50', borderRadius: '10px', padding: '3px', color: 'white', fontWeight: 'bold', display: 'flex', justifyContent: 'center' }}>Đã kết thúc</div>
                if (record?.status === 'Đã khởi hành') return <div style={{ backgroundColor: '#3282d1', borderRadius: '10px', padding: '3px', color: 'white', fontWeight: 'bold', display: 'flex', justifyContent: 'center' }}>Đã khởi hành</div>
                if (record?.status === 'Chưa khởi hành') return <div style={{ backgroundColor: '#F44336', borderRadius: '10px', padding: '3px', color: 'white', fontWeight: 'bold', display: 'flex', justifyContent: 'center' }}>Chưa khởi hành</div>
            },
            filters: [
                {
                    text: 'Đã kết thúc',
                    value: 'Đã kết thúc',
                },
                {
                    text: 'Đã khởi hành',
                    value: 'Đã khởi hành',
                },
                {
                    text: 'Chưa khởi hành',
                    value: 'Chưa khởi hành',
                },
            ],
            onFilter: (value, record) => {
                console.log('value', value, record);
                if (value === 'Đã kết thúc') return record?.status === 'Đã kết thúc'
                else if (value === 'Đã khởi hành') return record?.status === 'Đã khởi hành'
                else return record?.status === 'Chưa khởi hành'
            },
        },
        {
            title: "Vé đã bán",
            dataIndex: 'ticketsSold',
            align: 'center',
            key: 'timeStart',
            width: 100,
        },
        {
            title: "Giá vé",
            dataIndex: 'ticketPrice',
            key: 'ticketPrice',
            align: 'center',
            width: 100,
            render: (record) => {
                const num = record ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record) : null
                return <span style={{ color: '#2ec429   ', fontWeight: '500' }}>
                    {num ? num : null}
                </span>
            }
        },
        {
            title: "Chi tiết",
            key: 'detail',
            width: 80,
            align: 'center',
            render: (record) => {
                return <>
                    <ProfileOutlined onClick={() => { }} style={{ color: 'blue', fontSize: '16px' }} />
                </>
            }
        },
        {
            title: "Sửa",
            key: 'update',
            width: 60,
            align: 'center',
            render: (record) => {
                return <>
                    <EditOutlined onClick={() => { setIsUpdateTrip(true); setTripUpdate(record) }} style={{ color: 'green', fontSize: '16px' }} />
                </>
            }
        },
        {
            title: "Xóa",
            key: 'delete',
            width: 60,
            align: 'center',
            render: (record) => {
                return <>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa chuyến"
                        onConfirm={() => onDelete(record)}
                        okText="Đồng ý"
                        cancelText="Hủy"
                    >
                        <DeleteOutlined style={{ color: 'red', fontSize: '16px' }} />

                    </Popconfirm>

                </>
            }
        }

    ]

    const user = useSelector((state) => state.user)
    const [isCreateTrip, setIsCreateTrip] = useState(false)
    const [isUpdateTrip, setIsUpdateTrip] = useState(false)
    const [tripUpdate, setTripUpdate] = useState()
    const [listTrip, setListTrip] = useState([])
    const [filter, setFilter] = useState()
    const [day, setDay] = useState(dayjs().format('DD/MM/YYYY'))
    const [listRoute, setListRoute] = useState([])
    const [listBus, setListBus] = useState([])
    const [listDriver, setListDriver] = useState([])

    //Get all routes
    const { data: dataRoutes } = useQuery(
        {
            queryKey: ['routes'],
            queryFn: () => getRouteByBusOwner(JSON.parse(localStorage.getItem('bus_owner_id')), user?.access_token),
            staleTime: Infinity,
        });

    useEffect(() => {
        console.log('dataRoutes', dataRoutes);
        const listData = dataRoutes?.data?.map((route) => ({
            value: route?._id,
            label: `${route?.districtStart}-${route?.provinceStart} (${route?.placeStart}) -> ${route?.districtEnd}-${route?.provinceEnd} (${route?.placeEnd})`,
        }));
        setListRoute(listData);
    }, [dataRoutes])

    //Get all bus
    const { data: dataBuss } = useQuery(
        {
            queryKey: ['buss'],
            queryFn: () => getBussByBusOwner(user?.access_token, JSON.parse(localStorage.getItem('bus_owner_id'))),
            staleTime: Infinity,
        });
    useEffect(() => {
        console.log('dataRoutes', dataBuss);
        const listData = dataBuss?.data?.map((bus) => ({
            value: bus?._id,
            label: bus?.licensePlate,
        }));
        setListBus(listData);
    }, [dataBuss])

    //Get all driver
    const { data: dataDrivers } = useQuery(
        {
            queryKey: ['drivers'],
            queryFn: () => getDriversByBusOwner(user?.access_token, JSON.parse(localStorage.getItem('bus_owner_id'))),
            staleTime: Infinity,
        });
    useEffect(() => {
        console.log('dataRoutes', dataDrivers);
        const listData = dataDrivers?.data?.map((driver) => ({
            value: driver?._id,
            label: driver?.userId?.name,
        }));
        setListDriver(listData);
    }, [dataDrivers])

    const filterOption = (input, option) => {
        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    }



    const { data, isSuccess, isError, refetch } = useQuery(
        {
            queryKey: ['trips', day],
            queryFn: () => getTripsByBusOwner(JSON.parse(localStorage.getItem('bus_owner_id')), user?.access_token, day ? day : dayjs().format('DD/MM/YY')),
        });


    useEffect(() => {
        if (isSuccess) {
            setListTrip(data?.data)
        } else if (isError) {
            errorMes()
        }

    }, [isSuccess, isError, data])

    const onChangeDate = (time, timeString) => {
        setDay(timeString)
    }
    const handleCancel = () => {
        setIsCreateTrip(false)
    }

    const mutationDelete = useMutation(
        {
            mutationFn: (data) => {
                const { id, access_token } = data
                return deleteTrip(id, access_token)
            },
            onSuccess: (data) => {
                successMes(data?.message)
                refetch()
            },
            onError: (data) => {
                errorMes(data?.response?.data?.message)
            }
        }
    )
    const onDelete = (record) => {
        console.log(record);
        mutationDelete.mutate({ id: record._id, access_token: user?.access_token })
    }

    const handleCancelUpdate = () => {
        setTripUpdate()
        setIsUpdateTrip(false)
    }
    return (
        <div>
            <Row justify='space-between'>
                <div>
                    <DatePicker
                        format='DD/MM/YYYY'
                        style={{ width: '150px' }}
                        placeholder='Chọn ngày'
                        defaultValue={dayjs()}
                        onChange={onChangeDate}
                    />
                </div>
                <div>
                    <Button type="primary" onClick={() => { setIsCreateTrip(true) }} icon={<PlusOutlined />} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', marginBottom: '20px', marginRight: '60px' }}>
                        Thêm chuyến
                    </Button>
                </div>
            </Row>
            <Row>
                <div>
                    <Table
                        rowKey="_id"
                        bordered
                        pagination={false}
                        dataSource={listTrip}
                        columns={column}
                        scroll={{
                            y: 550,
                        }}
                    ></Table>
                </div>
            </Row>
            <ModalCreateTrip isCreateTrip={isCreateTrip} handleCancel={handleCancel} refetch={refetch} listRoute={listRoute} listBus={listBus} listDriver={listDriver} dataBuss={dataBuss} dataRoutes={dataRoutes} filterOption={filterOption}></ModalCreateTrip>
            <ModalUpdateTrip trip={tripUpdate} isUpdateTrip={isUpdateTrip} handleCancel={handleCancelUpdate} refetch={refetch} listBus={listBus} listDriver={listDriver} filterOption={filterOption}></ModalUpdateTrip>
        </div>
    )
}

export default TripManagerment