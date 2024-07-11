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
import dayjs from 'dayjs';
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
            dataIndex: 'busOwner',
            key: 'busOwner',
            width: 170,
            render: (record) => record.busOwnerName
        },
        {
            title: "Số điện thoại người báo cáo",
            dataIndex: 'phone',
            width: 130,
            key: 'phone',

        },
        {
            title: "Tiêu đề",
            dataIndex: 'title',
            key: 'title',
            width: 170,
        },
        {
            title: "Nội dung",
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: "Ngày",
            dataIndex: 'createdAt',
            key: 'content',
            width: 130,
            render: record => dayjs(record).format('DD-MM-YYYY')
        },
        {
            title: "Trạng thái",
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: record => record === 'processing' ? 'Đang xử lý' : 'Đã xử lý'
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


    return (
        <>
            <Table
                rowKey="id"
                bordered
                dataSource={listReport}
                columns={column}
                style={{ marginTop: 30 }}
            ></Table>
        </>
    )
}

export default AdminReportComponent