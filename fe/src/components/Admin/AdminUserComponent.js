import { Input, Table, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { deleteUser, editUser, getAllUser, updateUser } from '../../services/UserService'
import { Select } from 'antd';
import { errorMes, successMes } from '../Message/Message';
import dayjs from 'dayjs';
const { Option } = Select;



const AdminUserComponent = () => {

    const [isEdit, setIsEdit] = useState(false)
    const [isDelette, setIsDelette] = useState(false)
    const [userEditing, setUserEditing] = useState()
    const [userDeleting, setUserDeleting] = useState()
    const [users, setUsers] = useState([])
    const user = useSelector((state) => state.user);
    const [confirmLoading, setConfirmLoading] = useState(false)



    const { data, isSuccess, isError, refetch } = useQuery(
        {
            queryKey: ['users'],
            queryFn: () => getAllUser(user?.access_token),
        });

    useEffect(() => {
        if (isSuccess) {
            setUsers(data?.data)
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
            title: "Họ và Tên",
            dataIndex: 'name',
            key: 'name',

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
                record.name.toString().toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: "Email",
            dataIndex: 'email',
            key: 'email',
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
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: "Ngày sinh",
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
            render: (dateOfBirth) => dateOfBirth ? dayjs(dateOfBirth).format('DD/MM/YYYY') : dateOfBirth
        },
        {
            title: "Giới tính",
            dataIndex: 'gender',
            key: 'gender',
            render: (gender) => {
                switch (gender) {
                    case 'male':
                        return 'Nam'
                    case 'female':
                        return 'Nữ'
                    case 'other':
                        return 'Khác'
                    default:
                        return ' '
                }
            }
        },
        {
            title: "Vai trò",
            dataIndex: 'role',
            key: 'role',
            width: 120,
        },
        {
            title: "Sửa",
            key: 'edit',
            width: 60,
            render: (record) => {
                return <>
                    <EditOutlined onClick={() => OnEditUser(record)} style={{ color: 'green' }} />
                </>
            }
        },
        {
            title: "Xóa",
            key: 'delete',
            width: 60,
            render: (record) => {
                return <>
                    <DeleteOutlined onClick={() => OnDeleteUser(record)} style={{ color: 'red' }} />
                </>
            }
        }

    ]


    const OnEditUser = (record) => {
        setIsEdit(true)
        setUserEditing(record)
    }

    const mutationUpdate = useMutation({
        mutationFn: async (data) => {
            const { id, access_token, user } = data;
            return await editUser(id, access_token, user);
        },
        onSuccess: (data) => {
            successMes(data.message)
            setConfirmLoading(false)
            refetch()
            setIsEdit(false)
            // successMes('Sửa người dùng thành công !')
        },
        onError: (data) => {
            setConfirmLoading(false)
            setIsEdit(false)
            refetch()
            errorMes(data?.response?.data?.message)
        }
    });

    const mutationDeleted = useMutation({
        mutationFn: async (data) => {
            const { id, access_token, user } = data;
            await deleteUser(id, access_token, user);
        },
        onSuccess: () => {
            setConfirmLoading(false)
            refetch()
            setIsDelette(false)
            successMes('Xóa người dùng thành công !')
        },
        onError: () => {
            setConfirmLoading(false)
            setIsDelette(false)
            refetch()
            errorMes('Xóa người dùng không thành công !')
        }
    });

    // const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    // const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDelected, isError: isErrorDeleted } = mutationDeleted
    const HandleEditUser = () => {
        setConfirmLoading(true)
        mutationUpdate.mutate({ id: userEditing.id, user: userEditing, access_token: user?.access_token })
    }

    const OnDeleteUser = (record) => {
        setIsDelette(true)
        setUserDeleting(record)
    }
    const HandleDeleteUser = () => {
        setConfirmLoading(true)
        mutationDeleted.mutate({ id: userDeleting.id, user: userDeleting, access_token: user?.access_token })
    }

    return (
        <>
            <Table
                rowKey="id"
                bordered
                dataSource={users}
                columns={column}
                scroll={{
                    y: 500,
                }}
            ></Table>
            <Modal
                title="Chỉnh sửa người dùng"
                open={isEdit}
                okText='Xác nhận'
                onOk={() => {
                    HandleEditUser()
                }}
                cancelText='Hủy'
                onCancel={() => {
                    setIsEdit(false)
                }}
                confirmLoading={confirmLoading}

            >
                <span >Tên</span>
                <Input
                    style={{ marginBottom: '20px', marginTop: '10px' }}
                    value={userEditing?.name}
                    onChange={(e) => {
                        setUserEditing((pre) => {
                            return { ...pre, name: e.target.value }
                        })
                    }}
                />
                <span >Email</span>
                <Input
                    style={{ marginBottom: '20px', marginTop: '10px' }}
                    value={userEditing?.email}
                    disabled={true}
                />
                <span>Số điện thoại</span>
                <Input
                    style={{ marginBottom: '20px', marginTop: '10px' }}
                    value={userEditing?.phone}
                    onChange={(e) => {
                        setUserEditing((pre) => {
                            return { ...pre, phone: e.target.value }
                        })
                    }}
                />
                <div><span>Vai trò</span></div>
                <Select
                    style={{ width: '150px', marginTop: '10px' }}
                    value={userEditing?.role}
                    onChange={(value) => {
                        setUserEditing((pre) => {
                            return { ...pre, role: value }
                        })
                    }}
                >
                    <Option value="ADMIN">ADMIN</Option>
                    <Option value="BUSOWNER">BUSOWNER</Option>
                    <Option value="DRIVER">DRIVER</Option>
                    <Option value="AGENT">AGENT</Option>
                    <Option value="USER">USER</Option>
                </Select>

            </Modal>
            <Modal
                title='Bạn có chắc chắn muốn xóa người dùng ?'
                open={isDelette}
                okText='Xác nhận'
                onOk={() => {
                    HandleDeleteUser()
                }}
                cancelText='Hủy'
                onCancel={() => {
                    setIsDelette(false)
                }}
                confirmLoading={confirmLoading}

            >


            </Modal>
        </>
    )
}

export default AdminUserComponent