import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Input, Popconfirm, Select, Upload, Image } from 'antd'
import { UploadOutlined, CarOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { error, loading, success } from '../../Message';
import { deleteDriver } from '../../../services/DriverService';
import { deleteBus, updateBus } from '../../../services/BusService';
import axios from 'axios';
import { createPlace } from '../../../services/PlaceService';

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

const typeOfBus = [
    {
        value: 'xe limousine 7',
        label: 'Xe limousine 7 chỗ',
    },
    {
        value: 'xe limousine 9',
        label: 'Xe limousine 9 chỗ',
    },
    {
        value: 'xe limousine 12',
        label: 'Xe limousine 12 chỗ',
    },
    {
        value: 'xe limousine 17',
        label: 'Xe limousine 17 chỗ',
    },
    {
        value: 'xe limousine 19',
        label: 'Xe limousine 19 chỗ',
    },
    {
        value: 'xe khách 16',
        label: 'Xe khách 16 chỗ',
    },
    {
        value: 'xe khách 29',
        label: 'Xe khách 29 chỗ',
    },
    {
        value: 'xe khách 35',
        label: 'Xe khách 35 chỗ',
    },
    {
        value: 'xe khách 45',
        label: 'Xe khách 45 chỗ',
    },
    {
        value: 'xe giường nằm 22',
        label: 'Xe giường nằm 22 chỗ',
    },
    {
        value: 'xe giường nằm 34',
        label: 'Xe giường nằm 34 chỗ',
    },
    {
        value: 'xe giường nằm 40',
        label: 'Xe giường nằm 40 chỗ',
    },
    {
        value: 'Khác',
        label: 'Khác',
    },
]

const optionconvinients = [
    {
        value: 'Wifi',
        label: 'Wifi',
    },
    {
        value: 'Điều hòa',
        label: 'Điều hòa',
    },
    {
        value: 'Cổng sạc USB',
        label: 'Cổng sạc USB',
    },
    {
        value: 'Khăn lạnh',
        label: 'Khăn lạnh',
    },
    {
        value: 'Nước uống',
        label: 'Nước uống',
    },
    {
        value: 'Màn hình TV',
        label: 'Màn hình TV',
    },
    {
        value: 'Nhà vệ sinh',
        label: 'Nhà vệ sinh',
    },
    {
        value: 'Ghế massage',
        label: 'Ghế massage',
    },
    {
        value: 'Đèn Led đọc sách',
        label: 'Đèn Led đọc sách',
    },
    {
        value: 'Chăn gối',
        label: 'Chăn gối',
    },
];
const BusInformation = (props) => {
    const { bus, access_token, refetch } = props
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState();
    const [avatarFile, setAvatarFile] = useState();
    const [visible, setVisible] = useState(false);
    const formRef = useRef(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);


    useEffect(() => {
        form.setFieldsValue({
            licensePlate: bus?.licensePlate,
            color: bus?.color,
            convinients: bus?.convinients,
            typeBus: bus?.typeBus
            // licensePlate: bus?.licensePlate,
        });
        setFileList(bus?.images.map((img, index) => {
            return {
                url: `${img}`,
            }
        }))
        setImageUrl(bus?.avatar)
    }, [bus])

    const mutation = useMutation(
        {
            mutationFn: (data) => {
                const { id, access_token, ...rest } = data
                return updateBus(id, rest, access_token)
            }
        }
    )

    const { data, isSuccess, isError } = mutation

    useEffect(() => {
        if (isSuccess && data?.status === "OK") {
            success(data?.message)
            setVisible(false)
        } else if (isError || data?.status === "ERR") {
            error(data?.message)
        }
        refetch()
    }, [isSuccess, isError])

    const onFinish = (values) => {
        let images = fileList.filter((file) => {
            return file.url
        })
        if (images.length > 0) images = images.map((img) => img.url)

        const deleteImages = bus.images.filter(img => !images.includes(img))
        console.log('deleteImages', deleteImages);

        const newImages = fileList.filter((file) => {
            return !file.url
        })
        console.log(values.convinients?.length > 0);
        let data = {}
        if (values.licensePlate !== bus?.licensePlate) data = { ...data, licensePlate: values.licensePlate }
        if (values.color !== bus?.color) data = { ...data, color: values.color }
        if (JSON.stringify(values.convinients) !== JSON.stringify(bus?.convinients)) data = { ...data, convinients: values.convinients?.length > 0 ? values.convinients : 'null' }
        if (values.typeBus !== bus?.typeBus) {
            if (values.typeBus === 'Khác') {
                data = { ...data, typeBus: `${values.type} ${values.numberSeat}` }
                data = { ...data, numberSeat: values.numberSeat }
            }
            else data = { ...data, typeBus: values.typeBus }
        }
        if (avatarFile) data = { ...data, avatar: avatarFile }
        if (newImages.length > 0) { data = { ...data, images: images, newImages: newImages } }
        if (deleteImages.length > 0) { data = { ...data, images: images > 0 ? images : 'null', deleteImages: deleteImages } }
        if (Object.keys(data).length > 0) {
            console.log('aa', data);
            mutation.mutate({ ...data, id: bus?._id, access_token })
            setAvatarFile('')
            loading()
        }
    };

    const HandleSubmit = () => {
        formRef.current.submit()
    }


    const handleChange = (info) => {

        setAvatarFile(info.file.originFileObj)
        getBase64(info.file.originFileObj, (url) => {
            setImageUrl(url);
        });
    };


    const mutationDelete = useMutation(
        {
            mutationFn: (data) => {
                const { id, access_token } = data
                return deleteBus(id, access_token)
            }
        }
    )

    const { data: dataDelete, isSuccess: isSuccessDelete, isError: isErrorDelete } = mutationDelete

    useEffect(() => {
        if (isSuccessDelete && dataDelete?.status === "OK") {
            success(dataDelete?.message)
        } else if (isErrorDelete || dataDelete?.status === "ERR") {
            error(dataDelete?.message)
        }
        refetch()
    }, [isSuccessDelete, isErrorDelete])

    const handleDeleteBus = () => {
        mutationDelete.mutate({ id: bus._id, access_token })
    }

    const confirm = () => {
        // handleDeleteBus()    
        createPlace()
    };

    const onChange = (value) => {
        if (value === 'Khác') {
            setVisible(true)
        } else setVisible(false)
    };
    const onSearch = (value) => {
        console.log('search:', value);
    };

    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            getBase64(file.originFileObj, (url) => { file.preview = url });
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChangeList = ({ fileList }) => setFileList(fileList);

    return (
        <>
            <div style={{ overflowY: 'auto', width: '100%', maxHeight: '600px', backgroundColor: '#e0f2f5', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '0px 20px' }}>
                <Form
                    ref={formRef}
                    form={form}
                    onFinish={onFinish}

                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                        <h1>Thông tin xe</h1>

                        {
                            imageUrl ? <img
                                src={imageUrl}
                                style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '10px', marginBottom: '20px' }} /> :
                                <div
                                >
                                    <CarOutlined style={{ display: 'flex', justifyContent: 'center', backgroundColor: 'lightblue', fontSize: '120px', width: '120px', height: '120px', borderRadius: '10px', marginBottom: '20px' }} />
                                </div>
                        }

                        <Upload
                            showUploadList={false}
                            maxCount={1}
                            onChange={handleChange}
                        >
                            <Button icon={<UploadOutlined />}>Tải ảnh</Button>
                        </Upload>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Form.Item
                            style={{ flex: 1, marginRight: '20px' }}
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
                    <Form.Item
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
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>

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
                        label="Ảnh"
                    >
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChangeList}
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


                </Form>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <Button onClick={HandleSubmit} type="primary" htmlType="submit" >
                    Chỉnh sửa
                </Button>
                <Popconfirm
                    title="Xóa tài xế"
                    description="Bạn có chắc chắn muốn xóa tài xế"
                    onConfirm={confirm}
                    // onCancel={cancel}
                    okText="Đồng ý"
                    cancelText="Hủy"
                >
                    <Button type="primary" danger style={{ padding: '0px 35px', marginLeft: '30px' }} >
                        Xóa
                    </Button>
                </Popconfirm>

            </div>
        </>

    )
}

export default BusInformation