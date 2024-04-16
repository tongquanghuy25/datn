import { Input, Table, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { deleteUser, editUser, getAllUser, updateUser } from '../../services/UserService'
import { Select } from 'antd';
import { error, success } from '../Message';
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
        if (isSuccess && data?.status === "OK") {
            setUsers(data?.data)
        } else if (isError || data?.status === "ERR") {
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
                        console.log('se', selectedKeys[0]);
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
                        console.log('se', selectedKeys[0]);
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
            title: "Vai trò",
            dataIndex: 'role',
            key: 'role',
            width: 100,
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
            const { id, token, user } = data;
            await editUser(id, user, token);
        },
        onSuccess: () => {
            setConfirmLoading(false)
            refetch()
            setIsEdit(false)
            success('Sửa người dùng thành công !')
        },
        onError: () => {
            setConfirmLoading(false)
            setIsEdit(false)
            refetch()
            error('Sửa người dùng không thành công !')
        }
    });
    const mutationDeleted = useMutation({
        mutationFn: async (data) => {
            const { id, token, user } = data;
            await deleteUser(id, user, token);
        },
        onSuccess: () => {
            setConfirmLoading(false)
            refetch()
            setIsDelette(false)
            success('Xóa người dùng thành công !')
        },
        onError: () => {
            setConfirmLoading(false)
            setIsDelette(false)
            refetch()
            error('Xóa người dùng không thành công !')
        }
    });

    // const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    // const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDelected, isError: isErrorDeleted } = mutationDeleted
    const HandleEditUser = () => {
        setConfirmLoading(true)
        mutationUpdate.mutate({ id: userEditing._id, user: userEditing, token: user?.access_token })
    }

    const OnDeleteUser = (record) => {
        setIsDelette(true)
        setUserDeleting(record)
    }
    const HandleDeleteUser = () => {
        setConfirmLoading(true)
        mutationDeleted.mutate({ id: userDeleting._id, user: userDeleting, token: user?.access_token })
    }

    return (
        <>
            <Table
                rowKey="_id"
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
                    onChange={(e) => {
                        setUserEditing((pre) => {
                            return { ...pre, email: e.target.value }
                        })
                    }}
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
                    <Option value="admin">Admin</Option>
                    <Option value="busowner">Bus Owner</Option>
                    <Option value="user">User</Option>
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