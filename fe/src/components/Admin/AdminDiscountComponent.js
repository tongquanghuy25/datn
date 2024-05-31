import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Modal, Form, Input, DatePicker, Space, message, Select, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { getAllBusOwner } from '../../services/PartnerSevice';
import { errorMes, successMes } from '../Message/Message';
import { createDiscount, deleteDiscount, getAllDiscountByBusOwner } from '../../services/DiscountService';
import { getVnCurrency } from '../../utils';

const { Option } = Select;



const AdminDiscountComponent = () => {
    const user = useSelector((state) => state.user);
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [listBusOwner, setListBusOwner] = useState([]);
    const [listDiscount, setListDiscount] = useState([]);
    const [busOwnerId, setBusOwnerId] = useState('ALL');


    const { data, isSuccess, isError, refetch } = useQuery(
        {
            queryKey: ['discount', busOwnerId],
            queryFn: () => getAllDiscountByBusOwner(user?.access_token, busOwnerId),
        });

    useEffect(() => {
        if (isSuccess) {
            setListDiscount(data?.data)
        } else if (isError) {
            console.log('err', data);
        }
    }, [isSuccess, isError, data])

    const { data: busOwnerData, isSuccess: busOwnerIsSuccess, isError: busOwnerIsError } = useQuery(
        {
            queryKey: ['busOwner'],
            queryFn: () => getAllBusOwner(user?.access_token),
        });

    useEffect(() => {
        if (busOwnerIsSuccess) {
            setListBusOwner(busOwnerData?.data.map(item => {
                return { label: item.busOwnerName, value: item.id }
            }))
        } else if (busOwnerIsError) {
            console.log('err', busOwnerData);
        }
    }, [busOwnerIsSuccess, busOwnerIsError, busOwnerData])


    const columns = [
        {
            title: 'Mã',
            dataIndex: 'code',
            key: 'code',
            align: 'center',
        },
        {
            title: 'Giá trị',
            key: 'discountValue',
            render: record => {
                return record.discountType === 'percent' ? `${record.discountValue}%` : getVnCurrency(record.discountValue)
            },
            align: 'center',
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            key: 'startDate',
            align: 'center',
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'endDate',
            key: 'endDate',
            align: 'center',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: 400,
            align: 'center',
        },
        {
            title: 'Số lần sử dụng',
            dataIndex: 'numberUses',
            key: 'numberUses',
            align: 'center',
            align: 'center',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => handleDelete(record.id)}>Xóa</Button>
                </Space>
            ),
            align: 'center',
        },
    ];

    const showAddCouponModal = () => {
        setIsModalVisible(true);
    };

    const mutationCreate = useMutation({
        mutationFn: async (data) => {
            const { access_token, newDiscount } = data;
            return await createDiscount(access_token, newDiscount);
        },
        onSuccess: (data) => {
            // setIsModalVisible(false);
            successMes(data.message)
            refetch()
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    });

    const handleAddCoupon = () => {
        form.validateFields()
            .then(values => {
                // form.resetFields();
                // setIsModalVisible(false);
                const newDiscount = {
                    code: values.code,
                    discountType: values.discountType,
                    discountValue: values.discountValue,
                    startDate: values.startDate.format('DD-MM-YYYY'),
                    endDate: values.endDate.format('DD-MM-YYYY'),
                    description: values.description,
                    numberUses: values.numberUses,
                    busOwnerId: values.busOwnerId === 'ALL' ? null : values.busOwnerId
                }
                console.log('newDiscount', newDiscount);
                mutationCreate.mutate({ access_token: user?.access_token, newDiscount: newDiscount });
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const mutationDelete = useMutation({
        mutationFn: async (data) => {
            const { access_token, id } = data;
            return await deleteDiscount(access_token, id);
        },
        onSuccess: (data) => {
            successMes(data.message)
            refetch()
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    });
    const handleDelete = (id) => {
        mutationDelete.mutate({ access_token: user?.access_token, id });
    };


    return (
        <div >
            <Row justify={'space-between'}>
                <Select
                    showSearch
                    placeholder="Chọn nhà xe"
                    optionFilterProp="children"
                    value={busOwnerId}
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    style={{ width: '200px' }}
                    onSelect={value => { setBusOwnerId(value) }}
                >
                    <Option value="ALL">Tất cả</Option>
                    {listBusOwner && listBusOwner.map(busOwner => (
                        <Option key={busOwner.value} value={busOwner.value}>
                            {busOwner.label}
                        </Option>
                    ))}
                </Select>
                <Button type="primary" icon={<PlusOutlined />} onClick={showAddCouponModal} style={{ marginRight: '20px' }}>
                    Thêm mã giảm giá
                </Button>

            </Row>
            <Table
                columns={columns}
                dataSource={listDiscount}
                rowKey="id"
                bordered
                scroll={{
                    y: 430,
                }}
                style={{ marginTop: 20 }} />

            <Modal
                title="Thêm mã giảm giá"
                open={isModalVisible}
                onOk={handleAddCoupon}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="code"
                        label="Mã giảm giá (Nếu không nhập hệ thống sẽ tự động tạo mã!)"
                        rules={[
                            { pattern: /^[A-Z0-9]+$/, message: 'Mã giảm giá chỉ chứa chữ cái in hoa hoặc số!' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="busOwnerId"
                        label="Tên nhà xe"
                        rules={[{ required: true, message: 'Vui lòng chọn nhà xe!' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Chọn nhà xe"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            <Option value="ALL">Tất cả</Option>
                            {listBusOwner && listBusOwner.map(busOwner => (
                                <Option key={busOwner.value} value={busOwner.value}>
                                    {busOwner.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Row justify={'space-between'}>
                        <Form.Item
                            name="discountType"
                            label="Loại giảm giá"
                            rules={[{ required: true, message: 'Vui lòng chọn loại giảm giá!' }]}
                        >
                            <Select style={{ width: '200px' }}>
                                <Option value="percent">Phần trăm</Option>
                                <Option value="fixed">Giá trị cố định</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="discountValue"
                            label="Giá trị giảm giá"
                            rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm giá!' }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Row>
                    <Row justify={'space-between'}>
                        <Form.Item
                            name="startDate"
                            label="Ngày bắt đầu"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                        >
                            <DatePicker format='DD/MM/YYYY' style={{ width: '200px' }} />
                        </Form.Item>
                        <Form.Item
                            name="endDate"
                            label="Ngày hết hạn"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn!' }]}
                        >
                            <DatePicker format='DD/MM/YYYY' style={{ width: '200px' }} />
                        </Form.Item>
                    </Row>
                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="numberUses"
                        label="Số lần sử dụng"
                        rules={[{ required: true, message: 'Vui lòng nhập số lần sử dụng!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminDiscountComponent;
