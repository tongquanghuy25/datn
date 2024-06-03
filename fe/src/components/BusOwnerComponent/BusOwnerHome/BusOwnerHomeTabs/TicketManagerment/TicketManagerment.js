import { Button, Col, DatePicker, Input, Popconfirm, Row, Select, Space, Table, Tag } from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined, ProfileOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getTripsByBusOwner } from '../../../../../services/TripService';
import { errorMes, successMes, warningMes } from '../../../../Message/Message';
import { Option } from 'antd/es/mentions';
import { changeSeat, deleteSeat, deleteTicketOrder, getTicketOrderByTrip } from '../../../../../services/OrderService';
import { getListSeat } from '../../../../../utils/ListSeat';
import ModalAddTicket from './ModalAddTicket';
import { getVnCurrency } from '../../../../../utils';
import ModalEditTicket from './ModalEditTicket';
const { Search } = Input;


function isCancellationAllowed(departureDateStr, departureTimeStr, cancellationTimeInHours) {
    // Chuyển đổi chuỗi ngày và thời gian xuất phát thành đối tượng Date
    console.log('aa', departureDateStr, departureTimeStr, cancellationTimeInHours);
    const [day, month, year] = departureDateStr?.split('-').map(Number);
    const [hours, minutes] = departureTimeStr?.split(':').map(Number);
    const departureDate = new Date(year, month - 1, day, hours, minutes);

    // Tính thời gian giới hạn cho phép hủy chuyến
    const cancellationDeadline = new Date(departureDate.getTime() - cancellationTimeInHours * 60000 * 60);

    // Lấy thời gian hiện tại
    const currentDate = new Date();

    // So sánh thời gian hiện tại với thời gian giới hạn
    return currentDate <= cancellationDeadline;
}

const TicketManagerment = () => {
    const user = useSelector((state) => state.user)
    const [day, setDay] = useState(dayjs().format('DD/MM/YYYY'))
    const [listTrip, setListTrip] = useState([])
    const [trip, setTrip] = useState()
    const [listTicketOrder, setListTicketOrder] = useState([])
    const [listSeat, setListSeat] = useState([])
    const [isAddTicket, setIsAddTicket] = useState(false)
    const [seatCount, setSeatCount] = useState(0)
    const [isEditTicket, setIsEditTicket] = useState(false)
    const [ticketEditting, setTicketEditting] = useState()

    const [selectedSeat, setSelectedSeat] = useState(null);
    const [selectedEmptySeats, setSelectedEmptySeats] = useState([]);
    const [seatSwap, setSeatSwap] = useState(null);

    const mutationDelete = useMutation({
        mutationFn: async (data) => {
            const { id, access_token, ...rest } = data;
            return await deleteTicketOrder(id, access_token, rest);
        },
        onSuccess: () => {
            successMes('Xóa đơn vé thành công!')
            handleRefretch()
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    });

    const handleDeleteTicket = (record) => {
        const isOnTimeAllow = isCancellationAllowed(trip?.departureDate, trip?.departureTime, trip?.timeAlowCancel)
        mutationDelete.mutate({
            id: record?.id,
            access_token: user?.access_token,
            isOnTimeAllow: isOnTimeAllow,
            isPaid: record?.isPaid
        })
    }
    const column = [

        {
            title: "Tên",
            dataIndex: 'name',
            key: 'name',
            align: 'center',

        },
        {
            title: "Email",
            dataIndex: 'email',
            key: 'email',
            align: 'center',
        },
        {
            title: "Số điện thoại",
            dataIndex: 'phone',
            key: 'phone',
            align: 'center',
        },


        {
            title: "Số ghế",
            dataIndex: 'seatCount',
            key: 'seatCount',
            align: 'center',
        },
        {
            title: "Tổng tiền",
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            align: 'center',
            render: (record) => getVnCurrency(record)
        },
        {
            title: "Trạng thái",
            key: 'status',
            align: 'center',
            width: 150,
            render: (record) => {
                return <div >
                    <Tag
                        style={{ marginBottom: '10px' }}
                        color={record.status === 'Đã lên xe' ? 'blue' : (record.status === 'Đã hoàn thành' ? 'success' : 'warning')}
                    >
                        {record.status === 'Đã lên xe' ? record.status : (record.status === 'Đã hoàn thành' ? record.status : 'Chưa lên xe')}
                    </Tag>
                    {record.isPaid ? <Tag color='success'>Đã thanh toán</Tag> : <Tag color='error'>Chưa thanh toán</Tag>}
                </div>
            }
        },
        {
            title: "Hành động",
            key: 'action',
            width: 120,
            align: 'center',
            render: (record) => {
                return <Row justify={'space-around'}>
                    <EditOutlined onClick={() => { setTicketEditting(record); setIsEditTicket(true) }} style={{ color: 'green', fontSize: '16px' }} />
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa chuyến"
                        onConfirm={() => { handleDeleteTicket(record) }}
                        okText="Đồng ý"
                        cancelText="Hủy"
                    >
                        <DeleteOutlined style={{ color: 'red', fontSize: '16px' }} />
                    </Popconfirm>

                </Row>
            }
        }

    ]


    const resetSeat = () => {
        setSelectedSeat(null)
        setSelectedEmptySeats([])
        setSeatSwap(null)
    }

    const onChangeDate = (time, timeString) => {
        setDay(time.format('YYYY-MM-DD'))
        resetSeat()
        setTrip()
    }

    //Get all trip
    const { data, isSuccess, isError } = useQuery(
        {
            queryKey: [`trips`, day],
            queryFn: () => getTripsByBusOwner(JSON.parse(localStorage.getItem('bus_owner_id')), user?.access_token, day ? day : dayjs().format('YYYY-MM-DD')),
            // staleTime: 300000,
        });
    useEffect(() => {
        if (isSuccess) {
            setListTrip(data?.data)
        } else if (isError) {
            errorMes()
        }

    }, [isSuccess, isError, data])

    //Get tickets by trip
    const mutation = useMutation({
        mutationFn: async (data) => {
            const { tripId, token } = data;
            return await getTicketOrderByTrip(token, tripId);
        },
        onSuccess: (data) => {
            setListTicketOrder(data?.data)
            // successMes(data?.message)
            const list = getListSeat(trip?.busId.typeBus, data?.data)
            setListSeat(list)

        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    });
    const handleSelectTrip = (value) => {
        setTrip(listTrip?.find(item => item.id === value))
        mutation.mutate({ tripId: value, token: user?.access_token })
    }

    const handleRefretch = () => {
        mutation.mutate({ tripId: trip?.id, token: user?.access_token })
        resetSeat()
    }

    //Select Seat

    const mutationChange = useMutation({
        mutationFn: async (data) => {
            const { id, token, ...rest } = data;
            return await changeSeat(id, token, rest);
        },
        onSuccess: () => {
            successMes('Đổi ghế thành công!')
            handleRefretch()
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    });


    const handleSelectSeat = (seat) => {
        if (seat.data) {
            if (seatSwap) {
                warningMes("Vui lòng chọn một ghế trống để đổi chỗ.");
            } else {
                setSelectedSeat(seat.id === selectedSeat ? null : seat.id);
            }
        } else {
            if (seatSwap) {
                mutationChange.mutate({ id: seatSwap?.data?.id, access_token: user?.access_token, tripId: trip?.id, seats: seatSwap?.data.seats, seatSwap: seatSwap?.id, destinationSeat: seat?.id })
                setSeatSwap(null);
                setSelectedSeat(null);
                setSelectedEmptySeats([]);
            } else {
                if (selectedEmptySeats.includes(seat.id)) {
                    setSelectedEmptySeats(selectedEmptySeats.filter(id => id !== seat.id));
                } else {
                    setSelectedEmptySeats([...selectedEmptySeats, seat.id]);
                }
            }
        }
    };


    const handleAddTicket = (e) => {
        e.stopPropagation()
        setIsAddTicket(true)
        // setSelectedEmptySeats([])

    };

    const handleCancelSwap = () => {
        setSeatSwap(null);
        setSelectedSeat(null);
    };

    const mutationDeleteSeat = useMutation({
        mutationFn: async (data) => {
            const { token, ...rest } = data;
            return await deleteSeat(token, rest);
        },
        onSuccess: () => {
            successMes('Xóa ghế thành công!')
            handleRefretch()
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    });

    const handleDeleteSeat = (seat) => {
        const canCancel = isCancellationAllowed(trip?.departureDate, trip?.departureTime, trip?.timeAlowCancel);
        mutationDeleteSeat.mutate({ access_token: user?.access_token, ticketOrder: seat?.data, seatDelete: seat?.id, isOnTimeAllow: canCancel })
    };


    return (
        <div>
            <Row style={{ margin: '10px 0 0 20px' }} justify={'space-between'}>
                <Space>
                    <div>
                        <div>Chọn ngày</div>
                        <DatePicker
                            format='DD/MM/YYYY'
                            style={{ width: '150px' }}
                            placeholder='Chọn ngày'
                            defaultValue={dayjs()}
                            onChange={onChangeDate}
                        />
                    </div>
                    <div style={{ width: '400px', marginLeft: '30px' }}>
                        <div>Chọn chuyến</div>
                        <Select placeholder='Chọn chuyến xe' value={trip?.id} style={{ width: '400px' }} onSelect={(value) => { handleSelectTrip(value); resetSeat() }}>
                            {listTrip?.map(item => {
                                return <Option value={item.id}>
                                    <Tag color='error'>{item.departureTime}</Tag>
                                    <Tag color='warning'>{item.busId.licensePlate}</Tag>
                                    {item.routeId.districtStart}-{item.routeId.districtEnd}
                                </Option>
                            }
                            )}
                        </Select>
                    </div>
                    <div style={{ width: 200, marginLeft: '30px' }}>
                        <label>Tìm kiếm theo id đơn vé</label>
                        <Search
                            placeholder="Nhập id đơn hàng"
                        //   onSearch={onSearch}
                        />

                    </div>
                </Space>
                {trip && !trip?.prebooking && <Space>
                    <Button onClick={() => { setIsAddTicket(true) }} type='primary' icon={<PlusOutlined></PlusOutlined>} style={{ margin: '10px 20px 0 0' }}>Thêm vé</Button>
                </Space>}
            </Row>
            <Row>
                <div style={{ maxHeight: 'calc(100vh - 170px)', overflowY: 'auto', margin: '20px' }}>
                    {
                        trip?.prebooking && listSeat?.length > 0 ?
                            <div style={{ display: 'flex', flex: 1, flexWrap: 'wrap', gap: '16px' }}>
                                {listSeat?.map(seat => (

                                    <Col style={{ flex: '0 0 calc(25% - 16px)' }} key={seat.id}>
                                        <div
                                            onClick={() => {
                                                // if (!selectedEmptySeats.includes(seat.id) && seat.id !== selectedSeat)
                                                handleSelectSeat(seat)
                                            }}
                                            style={{ display: 'flex', flexDirection: 'column', border: '1px solid #666', borderRadius: '10px', padding: '5px 10px', height: '210px', backgroundColor: '#fff' }}>
                                            {seat.data ?
                                                <>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <div style={{ fontSize: '24px', fontWeight: 'bold', marginLeft: '10px' }}> {seat.id}</div>
                                                        <Tag
                                                            color={seat.data.status === 'Đã lên xe' ? 'blue' : (seat.data.status === 'Đã hoàn thành' ? 'success' : 'warning')}
                                                        >
                                                            {seat.data.status === 'Đã lên xe' ? seat.data.status : (seat.data.status === 'Đã hoàn thành' ? seat.data.status : 'Chưa lên xe')}
                                                        </Tag>
                                                    </div>
                                                    <div style={{ fontSize: '18px', fontWeight: '500', marginTop: '10px', marginBottom: '5px' }}>{seat.data?.name} - {seat.data.phone}</div>
                                                    <div><strong>Đón : </strong> {seat.data.pickUp} {seat.data.notePickUp && `(${seat.data.notePickUp})`}</div>
                                                    <div><strong>Trả : </strong> {seat.data.dropOff} {seat.data.noteDropOff && `(${seat.data.noteDropOff})`} </div>
                                                    <div style={{ marginBottom: '10px', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <div style={{ display: 'flex' }}>
                                                            <strong>Giá vé : </strong> <span style={{ color: 'red', marginLeft: '5px' }}>{getVnCurrency(seat.data.ticketPrice)}</span>
                                                        </div>
                                                        {seat.data.isPaid ? <Tag color='success'>Đã thanh toán</Tag> : <Tag color='error'>Chưa thanh toán</Tag>}
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    <div style={{ fontSize: '24px', fontWeight: 'bold', marginLeft: '10px' }}> {seat.id}</div>
                                                    <Row justify={'center'} style={{}}><h2>Ghế trống</h2></Row>
                                                </>
                                            }
                                            {selectedSeat === seat.id && seat.data && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#fff',
                                                    zIndex: 1,
                                                    borderRadius: '10px'
                                                }}>
                                                    {seatSwap ?
                                                        <Button type="primary" onClick={(e) => { e.stopPropagation(); handleCancelSwap() }} style={{ marginBottom: '10px' }}>Hủy đổi chỗ</Button>
                                                        :
                                                        <Button type="primary" onClick={(e) => { e.stopPropagation(); setSeatSwap(seat) }} style={{ marginBottom: '10px' }}>Đổi chỗ</Button>

                                                    }

                                                    <Button type="default" style={{ marginBottom: '10px' }} onClick={() => { setTicketEditting(seat?.data); setIsEditTicket(true) }}>Sửa</Button>
                                                    <Button type="primary" danger onClick={() => { handleDeleteSeat(seat) }}>Xóa</Button>
                                                </div>
                                            )}
                                            {selectedEmptySeats.includes(seat.id) && !seat.data && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#fff',
                                                    zIndex: 1,
                                                    borderRadius: '10px'
                                                }}>
                                                    <Button type="primary" onClick={handleAddTicket}>Thêm vé</Button>
                                                </div>
                                            )}

                                        </div>

                                    </Col>


                                ))}
                            </div>
                            :
                            <div>
                                {
                                    trip && <Table
                                        rowKey="id"
                                        bordered
                                        dataSource={listTicketOrder}
                                        columns={column}
                                        scroll={{
                                            y: 550,
                                        }}
                                    />
                                }
                            </div>
                    }

                </div>
            </Row>
            {
                isAddTicket &&
                <ModalAddTicket
                    trip={trip}
                    isAddTicket={isAddTicket}
                    setIsAddTicket={setIsAddTicket}
                    selectedEmptySeats={selectedEmptySeats}
                    seatCount={seatCount > 0 ? seatCount : selectedEmptySeats?.length}
                    handleRefretch={handleRefretch}
                />}

            {
                isEditTicket &&
                <ModalEditTicket
                    trip={trip}
                    ticket={ticketEditting}
                    isEditTicket={isEditTicket}
                    setIsEditTicket={setIsEditTicket}
                    handleRefretch={handleRefretch}
                />
            }
        </div>
    )
}

export default TicketManagerment