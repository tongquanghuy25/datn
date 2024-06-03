import React, { useEffect, useState } from 'react'
import { Button, DatePicker, Input, Popconfirm, Row, Table } from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined, ProfileOutlined } from '@ant-design/icons';
import ModalCreateTrip from './ModalCreateTrip';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteTrip, getTripsByBusOwner } from '../../../../../services/TripService';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { destroyMes, errorMes, loadingMes, successMes } from '../../../../Message/Message';
import ModalUpdateTrip from './ModalUpdateTrip';
import { getBussByBusOwner } from '../../../../../services/BusService';
import { getDriversByBusOwner } from '../../../../../services/DriverService';
import { getRouteByBusOwner } from '../../../../../services/RouteService';
import { convertTimeToHourMinute, getVnCurrency } from '../../../../../utils';

const TripManagerment = () => {


    const column = [

        {
            title: "Tuyến đường",
            dataIndex: 'route',
            key: 'route',
            width: 350,
            align: 'center',
            render: (route) => `${route.districtStart}-${route.provinceStart} -> ${route.districtEnd}-${route.provinceEnd}`

        },
        {
            title: "Xe",
            dataIndex: 'bus',
            key: 'bus',
            width: 120,
            align: 'center',
            render: (bus) => bus?.licensePlate
        },
        {
            title: "Tài xế",
            dataIndex: 'driver',
            key: 'driver',
            align: 'center',
            render: (driver) => driver?.user?.name
        },
        {
            title: "Giờ",
            dataIndex: 'departureTime',
            key: 'departureTime',
            width: 100,
            align: 'center',
            render: (departureTime) => {
                return convertTimeToHourMinute(departureTime)
            }
        },
        {
            title: "Trạng thái",
            key: 'status',
            align: 'center',
            width: 150,
            render: (record) => {
                if (record?.status === 'Ended') return <div style={{ backgroundColor: '#4CAF50', borderRadius: '10px', padding: '3px', color: 'white', fontWeight: 'bold', display: 'flex', justifyContent: 'center' }}>Đã kết thúc</div>
                if (record?.status === 'Started') return <div style={{ backgroundColor: '#3282d1', borderRadius: '10px', padding: '3px', color: 'white', fontWeight: 'bold', display: 'flex', justifyContent: 'center' }}>Đã khởi hành</div>
                if (record?.status === 'NotStarted') return <div style={{ backgroundColor: '#F44336', borderRadius: '10px', padding: '3px', color: 'white', fontWeight: 'bold', display: 'flex', justifyContent: 'center' }}>Chưa khởi hành</div>
            },
            filters: [
                {
                    text: 'Đã kết thúc',
                    value: 'Ended',
                },
                {
                    text: 'Đã khởi hành',
                    value: 'Started',
                },
                {
                    text: 'Chưa khởi hành',
                    value: 'NotStarted',
                },
            ],
            onFilter: (value, record) => {
                if (value === 'NotStarted') return record?.status === 'NotStarted'
                else if (value === 'Started') return record?.status === 'Started'
                else return record?.status === 'Ended'
            },
        },
        {
            title: "Đã bán",
            dataIndex: 'bookedSeats',
            align: 'center',
            key: 'bookedSeats',
            width: 80,
        },
        {
            title: "Giá vé",
            dataIndex: 'ticketPrice',
            key: 'ticketPrice',
            align: 'center',
            width: 100,
            render: (record) => {
                const num = record ? getVnCurrency(record) : null
                return <span style={{ color: '#2ec429   ', fontWeight: '500' }}>
                    {num ? num : null}
                </span>
            }
        },
        // {
        //     title: "Chi tiết",
        //     key: 'detail',
        //     width: 80,
        //     align: 'center',
        //     render: (record) => {
        //         return <>
        //             <ProfileOutlined onClick={() => { }} style={{ color: 'blue', fontSize: '16px' }} />
        //         </>
        //     }
        // },
        // {
        //     title: "Sửa",
        //     key: 'update',
        //     width: 60,
        //     align: 'center',
        //     render: (record) => {
        //         return <>
        //             <EditOutlined onClick={() => { setIsUpdateTrip(true); setTripUpdate(record) }} style={{ color: 'green', fontSize: '16px' }} />
        //         </>
        //     }
        // },
        {
            title: "Hành động",
            key: 'action',
            width: 120,
            align: 'center',
            render: (record) => {
                return <Row justify={'space-between'}>
                    <ProfileOutlined onClick={() => { }} style={{ color: 'blue', fontSize: '16px' }} />
                    <EditOutlined onClick={() => { setIsUpdateTrip(true); setTripUpdate(record) }} style={{ color: 'green', fontSize: '16px' }} />

                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa chuyến"
                        onConfirm={() => onDelete(record)}
                        okText="Đồng ý"
                        cancelText="Hủy"
                    >
                        <DeleteOutlined style={{ color: 'red', fontSize: '16px' }} />

                    </Popconfirm>

                </Row>
            }
        }

    ]

    const user = useSelector((state) => state.user)
    const [isCreateTrip, setIsCreateTrip] = useState(false)
    const [isUpdateTrip, setIsUpdateTrip] = useState(false)
    const [tripUpdate, setTripUpdate] = useState()
    const [listTrip, setListTrip] = useState([])
    const [filter, setFilter] = useState()
    const [day, setDay] = useState(dayjs().format('YYYY-MM-DD'))
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
            value: route?.id,
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
        console.log('dataBus', dataBuss);
        const listData = dataBuss?.data?.map((bus) => ({
            value: bus?.id,
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
            value: driver?.id,
            label: driver?.user?.name,
        }));
        setListDriver(listData);
    }, [dataDrivers])

    const filterOption = (input, option) => {
        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    }


    //Get all trip
    const { data, isSuccess, isError, refetch } = useQuery(
        {
            queryKey: [`trips`, day],
            queryFn: () => getTripsByBusOwner(JSON.parse(localStorage.getItem('bus_owner_id')), user?.access_token, day ? day : dayjs().format('YYYY-MM-DD')),
        });


    useEffect(() => {
        if (isSuccess) {
            setListTrip(data?.data)
        } else if (isError) {
            errorMes()
        }

    }, [isSuccess, isError, data])

    console.log('lll', listTrip);

    const onChangeDate = (date, dateString) => {
        setDay(date.format('YYYY-MM-DD'))
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
        mutationDelete.mutate({ id: record.id, access_token: user?.access_token })
    }

    const handleCancelUpdate = () => {
        setTripUpdate()
        setIsUpdateTrip(false)
    }
    return (
        <div style={{ marginTop: '20px', padding: '0 20px' }}>
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
                        rowKey="id"
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