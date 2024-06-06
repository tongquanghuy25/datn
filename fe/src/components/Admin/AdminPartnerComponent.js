import { Input, Table, Modal, Tabs, Row, Col, Form } from 'antd'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { errorMes, successMes } from '../Message/Message';
import { deleteAgent, deleteBusOwner, editAgent, editBusOwner, getAllAgent, getAllBusOwner } from '../../services/PartnerSevice';
import { editUser } from '../../services/UserService';
import TabPane from 'antd/es/tabs/TabPane';

const AdminPartnerComponent = () => {
    const user = useSelector((state) => state.user);
    const [form] = Form.useForm();
    const formRef = useRef(null);
    const [isEdit, setIsEdit] = useState(false)
    const [isDelette, setIsDelette] = useState(false)
    const [PartnerEditing, setPartnerEditing] = useState()
    const [PartnerDeleting, setPartnerDeleting] = useState()
    const [listData, setListData] = useState([])
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('busOwner');

    const { data, isSuccess, isError, refetch } = useQuery(
        {
            queryKey: ['partners', activeTab],
            queryFn: () => {
                if (activeTab === 'busOwner') {
                    return getAllBusOwner(user?.access_token)
                } else {
                    return getAllAgent(user?.access_token)
                }
            },
        });

    useEffect(() => {
        if (isSuccess) {
            setListData(data?.data)
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
            title: activeTab === 'busOwner' ? "Tên nhà xe" : "Tên đại lý",
            dataIndex: activeTab === 'busOwner' ? 'busOwnerName' : 'agentName',
            key: 'partnerName',

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
            onFilter: (value, record) => {
                if (activeTab === 'busOwner') return record.busOwnerName.toString().toLowerCase().includes(value.toLowerCase())
                else return record.agentName.toString().toLowerCase().includes(value.toLowerCase())
            }
        },
        {
            title: "Email",
            dataIndex: 'user',
            key: 'email',
            render: (user) => user?.email,
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
                record.user.email?.toString().toLowerCase().includes(value.toLowerCase()),
        },

        {
            title: "Số điện thoại",
            dataIndex: 'user',
            key: 'phone',
            render: (user) => user?.phone,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
                return <Input
                    autoFocus placeholder='Nhập số điện thoại muốn tìm ?'
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
                record.user.phone.toString().toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: "Địa chỉ",
            dataIndex: 'address',
            key: 'address',
            width: 300,
        },
        {
            title: "Loại hình doanh nghiệp",
            dataIndex: 'companyType',
            key: 'companyType',
            width: 200,
        },
        {
            title: "Sửa",
            key: 'edit',
            width: 60,
            render: (record) => {
                return <>
                    <EditOutlined onClick={() => OnEditPartner(record)} style={{ color: 'green' }} />
                </>
            }
        },
        {
            title: "Xóa",
            key: 'delete',
            width: 60,
            render: (record) => {
                return <>
                    <DeleteOutlined onClick={() => OnDeletePartner(record)} style={{ color: 'red' }} />
                </>
            }
        }

    ]

    const mutationUpdate = useMutation({
        mutationFn: async (data) => {
            const { id, partner, token } = data;
            if (activeTab === 'busOwner') {
                return await editBusOwner(id, token, partner);
            } else {
                return await editAgent(id, token, partner);
            }
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


    const OnEditPartner = (record) => {
        setPartnerEditing(record)
        console.log(record);
        form.setFieldsValue({
            partnerName: activeTab === 'busOwner' ? record.busOwnerName : record.agentName,
            address: record.address,
            companyType: record.companyType,
            companyDescription: record.companyDescription,
            managerName: record.managerName,
            managerEmail: record.managerEmail,
            citizenId: record.citizenId,
            managerPhone: record.managerPhone,
        })
        setIsEdit(true)
    }


    const onFinish = (values) => {
        if (activeTab === 'busOwner')
            values.busOwnerName = values.partnerName
        else
            values.agentName = values.partnerName
        setConfirmLoading(true)
        mutationUpdate.mutate({ id: PartnerEditing.id, partner: values, token: user?.access_token })
    }


    const mutationDeleted = useMutation({
        mutationFn: async (data) => {
            const { id, token } = data;
            if (activeTab === 'busOwner') {
                return await deleteBusOwner(id, token);
            } else {
                return await deleteAgent(id, token);
            }
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

    const OnDeletePartner = (record) => {
        setIsDelette(true)
        setPartnerDeleting(record)
    }
    const HandleDeletePartner = () => {
        setConfirmLoading(true)
        mutationDeleted.mutate({ id: PartnerDeleting.id, token: user?.access_token })
    }

    const formItemLayout = {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
        style: { marginBottom: '8px' }
    };

    return (
        <>
            <Tabs activeKey={activeTab} onChange={key => { setActiveTab(key) }}>
                <TabPane tab="Nhà xe" key="busOwner">
                </TabPane>
                <TabPane tab="Đại lý" key="agent">
                </TabPane>
            </Tabs>
            <div>
                <Table
                    rowKey="id"
                    bordered
                    dataSource={listData}
                    columns={column}
                    scroll={{
                        y: 500,
                    }}
                ></Table>

                {isEdit && <Modal
                    open={isEdit}
                    okText='Chỉnh sửa'
                    onOk={() => {
                        if (formRef.current) {
                            formRef.current.submit();
                        }
                    }}
                    cancelText='Hủy'
                    onCancel={() => {
                        setIsEdit(false)
                    }}
                    confirmLoading={confirmLoading}
                    width={'70%'}
                    height={'90%'}
                    style={{
                        top: 10,
                    }}
                >
                    <Form
                        ref={formRef}
                        form={form}
                        onFinish={onFinish}
                    >
                        <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                            Chỉnh sửa {activeTab === 'busOwner' ? 'Nhà xe' : 'Đại lý'}
                        </div>
                        <Row gutter={[48]}>

                            <Col span={14}>
                                <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '10px' }}>Thông tin nhà xe</div>

                                <Form.Item
                                    name="partnerName"
                                    hasFeedback
                                    label={activeTab === 'busOwner' ? 'Tên nhà xe' : 'Tên đại lý'}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Tên nhà xe không được bỏ trống !",
                                        }
                                    ]}
                                    {...formItemLayout}
                                >
                                    <Input placeholder="Tên nhà xe" size="large" />
                                </Form.Item>
                                <Form.Item
                                    name="address"
                                    label="Địa chỉ"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Địa chỉ không được bỏ trống !",
                                        }
                                    ]}
                                    {...formItemLayout}
                                >
                                    <Input placeholder="Địa chỉ" size="large" />
                                </Form.Item>
                                <Form.Item
                                    name="companyType"
                                    label="Loại hình doanh nghiệp"
                                    rules={[{ required: true, message: 'Vui lòng nhập loại hình doanh nghiệp!' }]}
                                    {...formItemLayout}
                                >
                                    <Input placeholder="Địa chỉ" size="large" />
                                </Form.Item>
                                <Form.Item
                                    name="companyDescription"
                                    label="Mô tả"
                                    {...formItemLayout}
                                >
                                    <Input.TextArea />
                                </Form.Item>
                            </Col>

                            <Col span={10}>
                                <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '10px' }}>Thông tin người quản lý</div>
                                <Form.Item
                                    name="managerName"
                                    hasFeedback
                                    label="Tên quản lý"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Tên quản lý không được bỏ trống !",
                                        }
                                    ]}
                                    {...formItemLayout}
                                >
                                    <Input placeholder="Tên quản lý" size="large" />
                                </Form.Item>
                                <Form.Item
                                    name="citizenId"
                                    hasFeedback
                                    label="Số căn cước"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Căn cước công dân không được bỏ trống !",
                                        }
                                    ]}
                                    {...formItemLayout}
                                >
                                    <Input placeholder="Nhập căn cước công dân" size="large" defaultValue="" />
                                </Form.Item>
                                <Form.Item
                                    label="Số điện thoại người quản lý"
                                    name="managerPhone"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập số điện thoại quản lý!'
                                        },
                                        {
                                            min: 10,
                                            max: 11,
                                            message: "Số điện thoại không đúng định dạng !",
                                        },]}
                                    {...formItemLayout}
                                >
                                    <Input placeholder="Số điện thoại quản lý" size="large" />
                                </Form.Item>
                                <Form.Item
                                    label="Email người quản lý"
                                    name="managerEmail"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập email quản lý!' },
                                        { type: 'email', message: 'Vui lòng nhập email hợp lệ!' }
                                    ]}
                                    {...formItemLayout}
                                >
                                    <Input placeholder="Email người quản lý" size="large" />
                                </Form.Item>
                            </Col>
                        </Row>


                    </Form>
                </Modal>
                }

                {
                    isDelette && <Modal
                        title={activeTab === 'busOwner' ? 'Bạn có chắc chắn muốn xóa nhà xe ?' : 'Bạn có chắc chắn muốn xóa đại lý ?'}
                        open={isDelette}
                        okText='Xác nhận'
                        onOk={() => {
                            HandleDeletePartner()
                        }}
                        cancelText='Hủy'
                        onCancel={() => {
                            setIsDelette(false)
                        }}
                        confirmLoading={confirmLoading}
                    >

                    </Modal>
                }
            </div>
        </>
    )
}

export default AdminPartnerComponent