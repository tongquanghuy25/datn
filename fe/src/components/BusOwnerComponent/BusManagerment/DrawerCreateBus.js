import React, { useEffect, useState } from 'react';
import { PlusOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, Upload, Image, Flex, message, Modal, Radio } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { driverRegister } from '../../../services/DriverService';
import { useSelector } from 'react-redux'
import { busRegister } from '../../../services/BusService';
import { optionconvinients, typeOfBus } from '../../../utils/TypeBus';

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

// const typeOfBus = typeOfBus

// const optionconvinients = optionconvinients

const DrawerCreateBus = (props) => {
    const { open, onClose, refetch } = props
    const user = useSelector((state) => state.user)
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState();
    const [avatarFile, setAvatarFile] = useState(null);
    const [visible, setVisible] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            getBase64(file.originFileObj, (url) => { file.preview = url });
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList }) => setFileList(fileList);

    const handleChangeAvatar = (info) => {
        setAvatarFile(info.file)
        getBase64(info.file?.originFileObj, (url) => {
            setImageUrl(url);
        });
    };
    const handleClose = () => {
        form.resetFields();
        setVisible(false)
        setFileList([])
        setAvatarFile('')
        setImageUrl('')
        onClose()
    }

    const mutation = useMutation(
        {
            mutationFn: (data) => {
                const { formData, access_token } = data
                return busRegister(access_token, formData)
            },
            onSuccess: (data) => {
                message.destroy()
                message.success({
                    content: `${data?.message}`,
                    style: {
                        marginLeft: '700px'
                    },
                });
                refetch()


            },
            onError: (data) => {
                message.destroy()
                message.error({
                    content: data?.response?.data?.message ? data?.response?.data?.message : 'Thêm xe thất bại!',
                    style: {
                        marginLeft: '700px'
                    },
                });
            }
        }
    )


    const onFinish = (values) => {
        message.destroy()
        message.loading({
            content: 'loading',
            style: {
                marginLeft: '700px'
            },
            duration: 10,
        });

        const formData = new FormData();
        formData.append('licensePlate', values.licensePlate);
        formData.append('typeBus', values.typeBus);
        formData.append('type', values.type);
        formData.append('numberSeat', values.numberSeat);
        formData.append('color', values.color);
        formData.append('convinients', values.convinients);
        formData.append('avatar', avatarFile?.originFileObj);
        fileList.forEach((file, index) => {
            formData.append(`images${index}`, file.originFileObj);
        });
        const busOwnerId = JSON.parse(localStorage.getItem('bus_owner_id'))
        formData.append('busOwnerId', busOwnerId);
        if (values?.typeSeat === 'seat') { formData.append('isRecliningSeat', false) }
        else formData.append('isRecliningSeat', true)
        if (values?.floorNumber === '1') formData.append('floorNumber', 1)
        else formData.append('floorNumber', 2)
        mutation.mutate({ formData, access_token: user.access_token })
    }

    const onChange = (value) => {
        if (value === 'Khác') {
            setVisible(true)
        } else setVisible(false)
    };
    const onSearch = (value) => {
    };

    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );
    return (
        <>
            <Drawer
                title="Thêm xe"
                width={720}
                onClose={handleClose}
                open={open}
                styles={{ body: { paddingBottom: 80, }, }}
            >

                <Form layout="vertical" form={form} onFinish={onFinish}>

                    <Form.Item
                        name="avatar"
                        label="Ảnh đại diện"
                    >
                        <Upload
                            style={{
                                width: '200px',
                                height: '200px',

                            }}
                            name="avatar"
                            listType="picture-circle"
                            className="avatar-uploader"
                            showUploadList={false}
                            onChange={handleChangeAvatar}
                        >
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="avatar"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '50%',
                                        objectFit: 'cover'
                                    }}
                                />
                            ) : (
                                uploadButton
                            )}
                        </Upload>
                    </Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Form.Item
                            style={{ marginRight: '20px', flex: 1 }}
                            name="licensePlate"
                            label="Biển số xe"
                            rules={[
                                {
                                    required: true,
                                    message: "Biển số không được bỏ trống !",
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            style={{ flex: 1 }}
                            name="color"
                            label="Màu xe"
                            rules={[
                                {
                                    required: true,
                                    message: "Màu xe không được bỏ trống !",
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Form.Item
                            style={{ marginRight: '20px', flex: 2 }}
                            name="typeBus"
                            label="Loại xe"
                            rules={[
                                {
                                    required: true,
                                    message: "Loại xe không được bỏ trống !",
                                }
                            ]}
                        >

                            <Select
                                showSearch
                                placeholder="Chọn loại xe"
                                optionFilterProp="children"
                                onChange={onChange}
                                onSearch={onSearch}
                                filterOption={filterOption}
                                options={typeOfBus}
                            />
                        </Form.Item>
                        {visible && (
                            <>
                                <Form.Item
                                    style={{ marginRight: '20px', flex: 1 }}
                                    name="type"
                                    label="Loại khác"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Loại xe không được bỏ trống !",
                                        }
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    style={{ flex: 1 }}
                                    name="numberSeat"
                                    label="Số chỗ"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Số chỗ không được bỏ trống !",
                                        }
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </>
                        )}
                    </div>

                    <Form.Item
                        name="typeSeat"
                        rules={[
                            {
                                required: true,
                                message: "Loại ghế không được bỏ trống !",
                            }
                        ]}>
                        <Radio.Group >
                            <Radio value="seat">Ghế ngồi</Radio>
                            <Radio value="bed">Ghế giường nằm</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        name="floorNumber"
                        rules={[
                            {
                                required: true,
                                message: "Số tầng không được bỏ trống !",
                            }
                        ]}>
                        <Radio.Group >
                            <Radio value="1">1 tầng</Radio>
                            <Radio value="2">2 tầng</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        // style={{ flex: 1 }}
                        name="convinients"
                        label="Tiện ích"
                    >
                        <Select
                            mode="tags"
                            style={{
                                width: '100%',
                            }}
                            tokenSeparators={[',']}
                            options={optionconvinients}
                        />
                    </Form.Item>


                    <Form.Item
                        // style={{ flex: 1 }}
                        name="images"
                        label="Ảnh của xe"
                    >
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                        >
                            <Button icon={<PlusOutlined />} />
                        </Upload>
                        {previewImage && (
                            <Image
                                preview={{
                                    visible: previewOpen,
                                    onVisibleChange: (visible) => setPreviewOpen(visible),
                                    afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                }}
                                src={previewImage}
                            />
                        )}
                    </Form.Item>

                    <Form.Item style={{ marginTop: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button type="primary" htmlType="submit">
                            Thêm xe
                        </Button>
                    </Form.Item>
                </Form>

            </Drawer>
        </>
    )
}

export default DrawerCreateBus