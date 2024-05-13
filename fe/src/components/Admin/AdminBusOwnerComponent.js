import { Input, Table, Modal, AutoComplete } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { SearchOutlined, EditOutlined, DeleteOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { Select } from 'antd';
import { errorMes, successMes } from '../Message/Message';
import { deleteBusOwner, editBusOwner, getAllBusOwner } from '../../services/BusOwnerSevice';
import { editUser } from '../../services/UserService';
const { Option } = Select;

const provinces = [
    "Hà Nội",
    "Hồ Chí Minh",
    "Đà Nẵng",
    "Hải Phòng",
    "Cần Thơ",
    "An Giang",
    "Bà Rịa - Vũng Tàu",
    "Bắc Giang",
    "Bắc Kạn",
    "Bạc Liêu",
    "Bắc Ninh",
    "Bến Tre",
    "Bình Định",
    "Bình Dương",
    "Bình Phước",
    "Bình Thuận",
    "Cà Mau",
    "Cao Bằng",
    "Đắk Lắk",
    "Đắk Nông",
    "Điện Biên",
    "Đồng Nai",
    "Đồng Tháp",
    "Gia Lai",
    "Hà Giang",
    "Hà Nam",
    "Hà Tĩnh",
    "Hải Dương",
    "Hậu Giang",
    "Hòa Bình",
    "Hưng Yên",
    "Khánh Hòa",
    "Kiên Giang",
    "Kon Tum",
    "Lai Châu",
    "Lâm Đồng",
    "Lạng Sơn",
    "Lào Cai",
    "Long An",
    "Nam Định",
    "Nghệ An",
    "Ninh Bình",
    "Ninh Thuận",
    "Phú Thọ",
    "Quảng Bình",
    "Quảng Nam",
    "Quảng Ngãi",
    "Quảng Ninh",
    "Quảng Trị",
    "Sóc Trăng",
    "Sơn La",
    "Tây Ninh",
    "Thái Bình",
    "Thái Nguyên",
    "Thanh Hóa",
    "Thừa Thiên Huế",
    "Tiền Giang",
    "Trà Vinh",
    "Tuyên Quang",
    "Vĩnh Long",
    "Vĩnh Phúc",
    "Yên Bái"
];

const AdminBusOwnerComponent = () => {
    const user = useSelector((state) => state.user);
    const [isEdit, setIsEdit] = useState(false)
    const [isDelette, setIsDelette] = useState(false)
    const [busOwnerEditing, setbusOwnerEditing] = useState()
    const [busOwnerDeleting, setBusOwnerDeleting] = useState()
    const [busOwners, setBusOwners] = useState([])
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [options, setOptions] = useState([]);
    const [startPoint, setStartPoint] = useState([]);
    const [endPoint, setEndPoint] = useState([]);

    const { data, isSuccess, isError, refetch } = useQuery(
        {
            queryKey: ['busOwner'],
            queryFn: () => getAllBusOwner(user?.access_token),
        });

    useEffect(() => {
        if (isSuccess) {
            setBusOwners(data?.data)
        } else if (isError) {
            console.log('err', data);
        }
    }, [isSuccess, isError, data])



    const column = [
        {
            title: 'STT',
            key: 'index',
            width: 60,
            render: (text, record, index) => index + 1,
        },
        {
            title: "Tên nhà xe",
            dataIndex: 'busOwnerName',
            key: 'busOwnerName',

            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
                return <Input
                    autoFocus placeholder='Nhập tên muốn tìm ?'
                    value={selectedKeys[0]}
                    onChange={(e) => {
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                        confirm({ closeDropdown: false })
                    }}
                    onPressEnter={() => { confirm() }}
                    onBlur={() => { confirm() }}

                >
                </Input>
            },
            filterIcon: () => {
                return <SearchOutlined style={{ marginLeft: '10px' }} />
            },
            onFilter: (value, record) =>
                record.busOwnerName.toString().toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: "Email",
            dataIndex: 'userId',
            key: 'email',
            render: (userId) => userId?.email,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
                return <Input
                    autoFocus placeholder='Nhập email muốn tìm ?'
                    value={selectedKeys[0]}
                    onChange={(e) => {
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                        confirm({ closeDropdown: false })
                    }}
                    onPressEnter={() => { confirm() }}
                    onBlur={() => { confirm() }}

                >
                </Input>
            },
            filterIcon: () => {
                return <SearchOutlined style={{ marginLeft: '10px' }} />
            },
            onFilter: (value, record) =>
                record.email.toString().toLowerCase().includes(value.toLowerCase()),
            // sorter: (a, b) => a.email - b.email,
        },

        {
            title: "Số điện thoại",
            dataIndex: 'userId',
            key: 'phone',
            render: (userId) => userId?.phone,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
                return <Input
                    autoFocus placeholder='Nhập email muốn tìm ?'
                    value={selectedKeys[0]}
                    onChange={(e) => {
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                        confirm({ closeDropdown: false })
                    }}
                    onPressEnter={() => { confirm() }}
                    onBlur={() => { confirm() }}

                >
                </Input>
            },
            filterIcon: () => {
                return <SearchOutlined style={{ marginLeft: '10px' }} />
            },
            onFilter: (value, record) =>
                record.phone.toString().toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: "Tuyến đường",
            dataIndex: 'route',
            key: 'route',
        },
        {
            title: "Địa chỉ",
            dataIndex: 'address',
            key: 'address',
            width: 300,
        },
        {
            title: "Sửa",
            key: 'edit',
            width: 60,
            render: (record) => {
                return <>
                    <EditOutlined onClick={() => OnEditBusOwner(record)} style={{ color: 'green' }} />
                </>
            }
        },
        {
            title: "Xóa",
            key: 'delete',
            width: 60,
            render: (record) => {
                return <>
                    <DeleteOutlined onClick={() => OnDeleteBusOwner(record)} style={{ color: 'red' }} />
                </>
            }
        }

    ]



    const mutationUpdate = useMutation({
        mutationFn: async (data) => {
            const { id, busOwner, token } = data;
            return await editBusOwner(id, busOwner, token);
        },
        onSuccess: (data) => {
            successMes(data?.message)
            setConfirmLoading(false)
            refetch()
            setIsEdit(false)
        },
        onError: (data) => {
            setConfirmLoading(false)
            setIsEdit(false)
            refetch()
            errorMes(data?.response?.data?.message)
        }
    });


    const OnEditBusOwner = (record) => {
        setbusOwnerEditing(record)
        setIsEdit(true)
    }
    useEffect(() => {
        if (busOwnerEditing?.route?.split(' - ')[0] === 'Bà Rịa' && busOwnerEditing?.route?.split(' - ')[2] === 'Bà Rịa') {
            setStartPoint('Bà Rịa - Vũng Tàu')
            setEndPoint('Bà Rịa - Vũng Tàu')
        } else if (busOwnerEditing?.route?.split(' - ')[0] === 'Bà Rịa') {
            setStartPoint(`${busOwnerEditing?.route?.split(' - ')[0]} - ${busOwnerEditing?.route?.split(' - ')[1]}`)
            setEndPoint(busOwnerEditing?.route?.split(' - ')[2])
        }
        else if (busOwnerEditing?.route?.split(' - ')[1] === 'Bà Rịa') {
            setStartPoint(busOwnerEditing?.route?.split(' - ')[0])
            setEndPoint(`${busOwnerEditing?.route?.split(' - ')[1]} - ${busOwnerEditing?.route?.split(' - ')[2]}`)
        }
        else {
            setStartPoint(busOwnerEditing?.route?.split(' - ')[0])
            setEndPoint(busOwnerEditing?.route?.split(' - ')[1])
        }
    }, [busOwnerEditing])

    const HandleEditBusOwner = () => {
        setConfirmLoading(true)
        if (startPoint && endPoint) {
            mutationUpdate.mutate({
                id: busOwnerEditing._id,
                busOwner: {
                    busOwnerName: busOwnerEditing.busOwnerName,
                    address: busOwnerEditing.address,
                    route: `${startPoint} - ${endPoint}`
                },
                token: user?.access_token
            })
        } else {
            mutationUpdate.mutate({ id: busOwnerEditing._id, busOwner: busOwnerEditing, token: user?.access_token })
        }
    }
    const mutationDeleted = useMutation({
        mutationFn: async (data) => {
            const { id, token, userId } = data;
            await editUser(userId, token, { role: 'user' });
            return await deleteBusOwner(id, token);
        },
        onSuccess: (data) => {
            setConfirmLoading(false)
            refetch()
            setIsDelette(false)
            successMes(data?.message)
        },
        onError: (data) => {
            setConfirmLoading(false)
            setIsDelette(false)
            refetch()
            errorMes(data?.response?.data?.message)
        }
    });

    const OnDeleteBusOwner = (record) => {
        setIsDelette(true)
        setBusOwnerDeleting(record)
    }
    const HandleDeleteBusOwner = () => {
        setConfirmLoading(true)
        mutationDeleted.mutate({ id: busOwnerDeleting._id, token: user?.access_token, userId: busOwnerDeleting?.userId._id })
    }


    const handleSearch = (value) => {
        const filteredOptions = provinces.filter(option =>
            option.toLowerCase().includes(value.toLowerCase())
        );
        setOptions(filteredOptions.map(option => ({ value: option })));
    };


    return (
        <>
            <Table
                rowKey="_id"
                bordered
                dataSource={busOwners}
                columns={column}
                scroll={{
                    y: 500,
                }}
            ></Table>

            <Modal
                title="Chỉnh sửa nhà xe"
                open={isEdit}
                okText='Xác nhận'
                onOk={() => {
                    HandleEditBusOwner()
                }}
                cancelText='Hủy'
                onCancel={() => {
                    setIsEdit(false)
                }}
                confirmLoading={confirmLoading}

            >
                <span >Tên nhà xe</span>
                <Input
                    style={{ marginBottom: '20px', marginTop: '10px' }}
                    value={busOwnerEditing?.busOwnerName}
                    onChange={(e) => {
                        setbusOwnerEditing((pre) => {
                            return { ...pre, busOwnerName: e.target.value }
                        })
                    }}
                />
                <span>Địa chỉ</span>
                <Input
                    style={{ marginBottom: '20px', marginTop: '10px' }}
                    value={busOwnerEditing?.address}
                    onChange={(e) => {
                        setbusOwnerEditing((pre) => {
                            return { ...pre, address: e.target.value }
                        })
                    }}
                />
                <span >Tuyến đường</span>
                <div style={{ display: 'flex', marginTop: '10px', marginBottom: '20px' }}>
                    <AutoComplete
                        style={{ width: 200 }}
                        options={options}
                        onSearch={handleSearch}
                        onSelect={(value) => { setStartPoint(value); setOptions([]) }}
                        placeholder="Chọn tỉnh"
                        onChange={(value) => setStartPoint(value)}
                        value={startPoint}
                    />
                    <ArrowRightOutlined style={{ marginLeft: '10px', marginRight: '10px' }} />
                    <AutoComplete
                        style={{ width: 200 }}
                        options={options}
                        onSearch={handleSearch}
                        onSelect={(value) => { setEndPoint(value); setOptions([]) }}
                        placeholder="Chọn tỉnh"
                        onChange={(value) => setEndPoint(value)}
                        value={endPoint}
                    />
                </div>
            </Modal>

            <Modal
                title='Bạn có chắc chắn muốn xóa nhà xe ?'
                open={isDelette}
                okText='Xác nhận'
                onOk={() => {
                    HandleDeleteBusOwner()
                }}
                cancelText='Hủy'
                onCancel={() => {
                    setIsDelette(false)
                }}
                confirmLoading={confirmLoading}

            />

        </>
    )
}

export default AdminBusOwnerComponent