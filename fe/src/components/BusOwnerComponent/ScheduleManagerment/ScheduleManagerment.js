import React, { useEffect, useState } from 'react'
import { Button, DatePicker, Input, Popconfirm, Row, Table } from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined, ProfileOutlined } from '@ant-design/icons';
import ModalCreateSchedule from './ModalCreateSchedule';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteSchedule, getSchedulesByBusOwner } from '../../../services/ScheduleService';
import { useSelector } from 'react-redux';
import { destroyMes, errorMes, loadingMes, successMes } from '../../Message/Message';
import ModalUpdateSchedule from './ModalUpdateSchedule';
import { getBussByBusOwner } from '../../../services/BusService';
import { getDriversByBusOwner } from '../../../services/DriverService';
import { getRouteByBusOwner } from '../../../services/RouteService';
import { getVnCurrency } from '../../../utils';

const dayMapping = {
    Monday: 'Thứ Hai',
    Tuesday: 'Thứ Ba',
    Wednesday: 'Thứ Tư',
    Thursday: 'Thứ Năm',
    Friday: 'Thứ Sáu',
    Saturday: 'Thứ Bảy',
    Sunday: 'Chủ Nhật',
};

const ScheduleManagerment = () => {

    const column = [

        {
            title: "Tuyến đường",
            dataIndex: 'route',
            key: 'route',
            width: 400,
            align: 'center',
            render: (route) => `${route.districtStart}-${route.provinceStart} -> ${route.districtEnd}-${route.provinceEnd}`

        },
        {
            title: "Xe",
            dataIndex: 'bus',
            key: 'bus',
            width: 200,
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
        {
            title: "Lịch trình",
            key: 'ticketPrice',
            align: 'center',
            width: 200,
            render: (record) => {
                let result = ''
                if (record.scheduleType === 'Daily') result = 'Hàng ngày'
                else if (record.scheduleType === 'WeeklyDays') {
                    const days = JSON.parse(record.inforSchedule)
                    const thus = days.map(day => dayMapping[day])
                    result = `${thus.join(', ')} hàng tuần`
                } else if (record.scheduleType === 'Periodic') result = `${JSON.parse(record.inforSchedule)} ngày một chuyến`
                return <>
                    {result}
                </>
            }
        },
        // {
        //     title: "Sửa",
        //     key: 'update',
        //     width: 60,
        //     align: 'center',
        //     render: (record) => {
        //         return <>
        //             <EditOutlined onClick={() => { setIsUpdateSchedule(true); setScheduleUpdate(record) }} style={{ color: 'green', fontSize: '16px' }} />
        //         </>
        //     }
        // },
        {
            title: "Hành động",
            key: 'delete',
            width: 120,
            align: 'center',
            render: (record) => {
                return <>
                    <EditOutlined onClick={() => { setIsUpdateSchedule(true); setScheduleUpdate(record) }} style={{ color: 'green', fontSize: '16px', marginRight: '20px' }} />

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
    const [isCreateSchedule, setIsCreateSchedule] = useState(false)
    const [isUpdateSchedule, setIsUpdateSchedule] = useState(false)
    const [scheduleUpdate, setScheduleUpdate] = useState()
    const [listSchedule, setListSchedule] = useState([])
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
        const listData = dataDrivers?.data?.map((driver) => ({
            value: driver?.id,
            label: driver?.user?.name,
        }));
        setListDriver(listData);
    }, [dataDrivers])

    const filterOption = (input, option) => {
        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    }


    //Get all Schedule
    const { data, isSuccess, isError, refetch } = useQuery(
        {
            queryKey: [`schedules`],
            queryFn: () => getSchedulesByBusOwner(JSON.parse(localStorage.getItem('bus_owner_id')), user?.access_token),
        });

    useEffect(() => {
        if (isSuccess) {
            setListSchedule(data?.data)
        } else if (isError) {
            errorMes()
        }

    }, [isSuccess, isError, data])

    const handleCancel = () => {
        setIsCreateSchedule(false)
        setScheduleUpdate()
        setIsUpdateSchedule(false)
    }

    const mutationDelete = useMutation(
        {
            mutationFn: (data) => {
                const { id, access_token } = data
                return deleteSchedule(id, access_token)
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
        setScheduleUpdate()
        setIsUpdateSchedule(false)
    }
    console.log('listSchedule', listSchedule);

    return (
        <div style={{ marginTop: '20px', padding: '0 20px' }}>
            <Row justify='end'>

                <div>
                    <Button type="primary" onClick={() => { setIsCreateSchedule(true) }} icon={<PlusOutlined />} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', marginBottom: '20px', marginRight: '60px' }}>
                        Thêm lịch trình
                    </Button>
                </div>
            </Row>
            <Row>
                <div>
                    <Table
                        rowKey="id"
                        bordered
                        pagination={false}
                        dataSource={listSchedule}
                        columns={column}
                        scroll={{
                            y: 550,
                        }}
                    ></Table>
                </div>
            </Row>
            <ModalCreateSchedule
                isCreateSchedule={isCreateSchedule}
                handleCancel={handleCancel}
                refetch={refetch}
                listRoute={listRoute}
                listBus={listBus}
                listDriver={listDriver}
                dataBuss={dataBuss}
                dataRoutes={dataRoutes}
                filterOption={filterOption} />

            <ModalUpdateSchedule
                schedule={scheduleUpdate}
                isUpdateSchedule={isUpdateSchedule}
                handleCancel={handleCancelUpdate}
                refetch={refetch} listBus={listBus}
                listDriver={listDriver}
                filterOption={filterOption}
                dataBuss={dataBuss}
            />
        </div>
    )
}

export default ScheduleManagerment