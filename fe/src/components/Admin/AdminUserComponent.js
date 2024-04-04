import { Input, Table, Modal } from 'antd'
import React, { useState } from 'react'
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

const AdminUserComponent = () => {

    const [isEdit, setIsEdit] = useState(false)
    const [userEditing, setUserEditing] = useState()

    const data = [
        {
            id: '1',
            name: 'Hung',
            email: 'huy123@gmail.com',
            address: '1b abc def ghh',
            phone: '0123456789'
        },
        {
            id: '2',
            name: 'Dat',
            email: 'huy123@gmail.com',
            address: '1b abc def ghh',
            phone: '0123456789'
        },
        {
            id: '3',
            name: 'Viet',
            email: 'aaahuy123@gmail.com',
            address: '1b abc def ghh',
            phone: '0123456789'
        },
        {
            id: '4',
            name: 'Nam',
            email: 'huy1234@gmail.com',
            address: '1b abc def ghh',
            phone: '0123456789'
        },
        {
            id: '5',
            name: 'Huy',
            email: 'huy1233@gmail.com',
            address: '1b abc def ghh',
            phone: '0123456789'
        },
        {
            id: '6',
            name: 'Huy',
            email: 'huy12@gmail.com',
            address: '1b abc def ghh',
            phone: '0123456789'
        },
        {
            id: '7',
            name: 'Huy',
            email: 'huy123@gmail.com',
            address: '1b abc def ghh',
            phone: '0123456789'
        },
        {
            id: '7',
            name: 'Huy',
            email: 'huy123@gmail.com',
            address: '1b abc def ghh',
            phone: '0123456789'
        },
        {
            id: '7',
            name: 'Huy',
            email: 'huy123@gmail.com',
            address: '1b abc def ghh',
            phone: '0123456789'
        },
        {
            id: '7',
            name: 'Huy',
            email: 'huy123@gmail.com',
            address: '1b abc def ghh',
            phone: '0123456789'
        },
        {
            id: '7',
            name: 'Huy',
            email: 'huy123@gmail.com',
            address: '1b abc def ghh',
            phone: '0123456789'
        },
        {
            id: '7',
            name: 'Huy',
            email: 'huy123@gmail.com',
            address: '1b abc def ghh',
            phone: '0123456789'
        },
        {
            id: '7',
            name: 'Huy',
            email: 'huy123@gmail.com',
            address: '1b abc def ghh',
            phone: '0123456789'
        },
        {
            id: '7',
            name: 'Huy',
            email: 'huy123@gmail.com',
            address: '1b abc def ghh',
            phone: '0123456789'
        },
        {
            id: '7',
            name: 'Huy',
            email: 'huy123@gmail.com',
            address: '1b abc def ghh',
            phone: '0123456789'
        },
        {
            id: '7',
            name: 'Huy',
            email: 'huy123@gmail.com',
            address: '1b abc def ghh',
            phone: '0123456789'
        },
        {
            id: '7',
            name: 'Huy',
            email: 'huy123@gmail.com',
            address: '1b abc def ghh',
            phone: '0123456789'
        },
        {
            id: '7',
            name: 'Huy',
            email: 'huy123@gmail.com',
            address: '1b abc def ghh',
            phone: '0123456789'
        },
        {
            id: '7',
            name: 'Huy',
            email: 'huy123@gmail.com',
            address: '1b abc def ghh',
            phone: '0123456789'
        },
        {
            id: '7',
            name: 'Huy',
            email: 'huy123@gmail.com',
            address: '1b abc def ghh',
            phone: '0123456789'
        },
        {
            id: '7',
            name: 'Huy',
            email: 'huy123@gmail.com',
            address: '1b abc def ghh',
            phone: '0123456789'
        },
        {
            id: '7',
            name: 'Huy',
            email: 'huy123@gmail.com',
            address: '1b abc def ghh',
            phone: '0123456789'
        },
        {
            id: '7',
            name: 'Huy',
            email: 'huy123@gmail.com',
            address: '1b abc def ghh',
            phone: '0123456789'
        },
    ]


    const column = [
        {
            title: "id",
            dataIndex: 'id'
        },
        {
            title: "Name",
            dataIndex: 'name',

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
            title: "email",
            dataIndex: 'email',
            sorter: (a, b) => a.email - b.email,
        },
        {
            title: "phone",
            dataIndex: 'phone'
        },
        {
            title: "address",
            dataIndex: 'address'
        },
        {
            title: "Sửa",
            render: (record) => {
                return <>
                    <EditOutlined onClick={() => HandleEditUser(record)} style={{ color: 'green' }} />
                </>
            }
        },
        {
            title: "Xóa",
            render: (record) => {
                return <>
                    <DeleteOutlined onClick={() => HandleDeleteUser(record)} style={{ color: 'red' }} />
                </>
            }
        }

    ]

    const HandleDeleteUser = (record) => {
        Modal.confirm(
            {
                title: `bạn có chắc chắn muốn xóa người dùng ` + record.name,
                okText: "Xác nhận",
                okType: 'danger',
                onOk: () => {

                },
                cancelText: "Hủy"
            }
        )
    }
    const HandleEditUser = (record) => {
        setIsEdit(true)
        setUserEditing(record)
    }
    return (
        <>
            <Table
                dataSource={data}
                columns={column}
                pagination={{
                    pageSize: 9
                }}></Table>
            <Modal
                title="Chỉnh sửa người dùng"
                open={isEdit}
                okText='Xác nhận'
                onOk={() => {
                    setIsEdit(false)
                    console.log('huy1', userEditing);
                }}
                cancelText='Hủy'
                onCancel={() => {
                    setIsEdit(false)
                }}

            >
                <span >Tên</span>
                <Input
                    style={{ marginBottom: '10px' }}
                    value={userEditing?.name}
                    onChange={(e) => {
                        setUserEditing((pre) => {
                            return { ...pre, name: e.target.value }
                        })
                    }}
                />
                <span >Email</span>
                <Input
                    style={{ marginBottom: '10px' }}
                    value={userEditing?.email}
                    onChange={(e) => {
                        setUserEditing((pre) => {
                            return { ...pre, email: e.target.value }
                        })
                    }}
                />
                <span>Số điện thoại</span>
                <Input
                    style={{ marginBottom: '10px' }}
                    value={userEditing?.phone}
                    onChange={(e) => {
                        setUserEditing((pre) => {
                            return { ...pre, phone: e.target.value }
                        })
                    }}
                />
                <span>Địa chỉ</span>
                <Input
                    style={{ marginBottom: '10px' }}
                    value={userEditing?.address}
                    onChange={(e) => {
                        setUserEditing((pre) => {
                            return { ...pre, address: e.target.value }
                        })
                    }}
                />

            </Modal>
        </>
    )
}

export default AdminUserComponent