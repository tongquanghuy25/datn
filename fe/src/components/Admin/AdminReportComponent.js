import { Input, Table, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { deleteUser, editUser, getAllUser, updateUser } from '../../services/UserService'
import { Select } from 'antd';
import { errorMes, successMes } from '../Message/Message';
import { getAllReport } from '../../services/ReportService';
const { Option } = Select;


const AdminReportComponent = () => {

    const user = useSelector((state) => state.user);
    const [isEdit, setIsEdit] = useState(false)
    const [isDelete, setIsDelete] = useState(false)
    // const [userDeleting, setUserDeleting] = useState()
    const [listReport, setListReport] = useState([])
    const [confirmLoading, setConfirmLoading] = useState(false)



    const { data, isSuccess, isError, refetch } = useQuery(
        {
            queryKey: ['reports'],
            queryFn: () => getAllReport(user?.access_token),
        });

    useEffect(() => {
        if (isSuccess) {
            setListReport(data?.data)
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
            dataIndex: 'busOwnerId',
            key: 'busOwnerId',
            render: (record) => record.busOwnerName
        },
        {
            title: "Số điện thoại người báo cáo",
            dataIndex: 'phone',
            key: 'phone',

        },
        {
            title: "Tiêu đề",
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: "Nội dung",
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: "Trạng thái",
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: "Sửa",
            key: 'edit',
            width: 60,
            render: (record) => {
                return <>
                    <EditOutlined onClick={() => { }} style={{ color: 'green' }} />
                </>
            }
        },
        {
            title: "Xóa",
            key: 'delete',
            width: 60,
            render: (record) => {
                return <>
                    <DeleteOutlined onClick={() => { }} style={{ color: 'red' }} />
                </>
            }
        }

    ]


    // const OnEditUser = (record) => {
    //     setIsEdit(true)
    //     setUserEditing(record)
    // }

    // const mutationUpdate = useMutation({
    //     mutationFn: async (data) => {
    //         const { id, access_token, user } = data;
    //         return await editUser(id, access_token, user);
    //     },
    //     onSuccess: (data) => {
    //         successMes(data.message)
    //         setConfirmLoading(false)
    //         refetch()
    //         setIsEdit(false)
    //         // successMes('Sửa người dùng thành công !')
    //     },
    //     onError: (data) => {
    //         setConfirmLoading(false)
    //         setIsEdit(false)
    //         refetch()
    //         errorMes(data?.response?.data?.message)
    //     }
    // });

    // const mutationDeleted = useMutation({
    //     mutationFn: async (data) => {
    //         const { id, access_token, user } = data;
    //         await deleteUser(id, access_token, user);
    //     },
    //     onSuccess: () => {
    //         setConfirmLoading(false)
    //         refetch()
    //         setIsDelete(false)
    //         successMes('Xóa người dùng thành công !')
    //     },
    //     onError: () => {
    //         setConfirmLoading(false)
    //         setIsDelete(false)
    //         refetch()
    //         errorMes('Xóa người dùng không thành công !')
    //     }
    // });

    // const HandleEditUser = () => {
    //     setConfirmLoading(true)
    //     mutationUpdate.mutate({ id: userEditing.id, user: userEditing, access_token: user?.access_token })
    // }

    // const OnDeleteUser = (record) => {
    //     setIsDelete(true)
    //     setUserDeleting(record)
    // }
    // const HandleDeleteUser = () => {
    //     setConfirmLoading(true)
    //     mutationDeleted.mutate({ id: userDeleting.id, user: userDeleting, access_token: user?.access_token })
    // }

    return (
        <>
            <Table
                rowKey="id"
                bordered
                dataSource={listReport}
                columns={column}
                scroll={{
                    y: 500,
                }}
            ></Table>
            {/* <Modal
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
                open={isDelete}
                okText='Xác nhận'
                onOk={() => {
                    HandleDeleteUser()
                }}
                cancelText='Hủy'
                onCancel={() => {
                    setIsDelete(false)
                }}
                confirmLoading={confirmLoading}

            >


            </Modal> */}
        </>
    )
}

export default AdminReportComponent