import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Input, Popconfirm, Select, Upload, Image, Radio } from 'antd'
import { UploadOutlined, CarOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { errorMes, loadingMes, successMes } from '../../Message/Message';
import { deleteBus, updateBus } from '../../../services/BusService';
import { optionconvinients, typeOfBus } from '../../../utils/TypeBus';
import { getBase64 } from '../../../utils';

const BusInformation = (props) => {
    const { bus, access_token, refetch } = props
    const [form] = Form.useForm();
    const formRef = useRef(null);
    const [imageUrl, setImageUrl] = useState();
    const [avatarFile, setAvatarFile] = useState();
    const [visible, setVisible] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);


    useEffect(() => {
        form.setFieldsValue({
            licensePlate: bus?.licensePlate,
            color: bus?.color,
            convinients: bus?.convinients ? JSON.parse(bus?.convinients) : null,
            typeBus: bus?.typeBus,
            typeSeat: bus?.typeSeat,
            floorNumber: bus?.floorNumber === 1 ? '1' : '2'
        });
        let list
        if (bus?.images)
            list = JSON.parse(bus?.images)?.map((img, index) => {
                return {
                    url: `${img}`,
                }
            })
        setFileList(list)
        setImageUrl(bus?.avatar)
    }, [bus])

    const mutation = useMutation(
        {
            mutationFn: (data) => {
                const { id, access_token, ...rest } = data
                return updateBus(id, rest, access_token)
            },
            onSuccess: (data) => {
                successMes(data?.message)
                setVisible(false)
                refetch()

            },
            onError: (data) => {
                errorMes(data?.response?.data?.message)
            }
        }
    )

    const onFinish = (values) => {
        let images = fileList?.filter((file) => {
            return file.url
        })
        if (images?.length > 0) images = images?.map((img) => img.url)

        let deleteImages
        if (bus.images) deleteImages = JSON.parse(bus.images)?.filter(img => !images.includes(img))

        const newImages = fileList?.filter((file) => {
            return !file.url
        })
        let data = {}
        if (values.licensePlate !== bus?.licensePlate) data = { ...data, licensePlate: values.licensePlate }
        if (values.color !== bus?.color) data = { ...data, color: values.color }
        if (JSON.stringify(values.convinients) !== JSON.stringify(bus?.convinients)) data = { ...data, convinients: values.convinients?.length > 0 ? values.convinients : 'null' }
        if (values.typeBus !== bus?.typeBus) {
            if (values.typeBus === 'Khác') {
                data = { ...data, typeBus: `${values.type} ${values.numberSeat}` }
                data = { ...data, numberSeat: values.numberSeat }
            }
            else data = { ...data, typeBus: values.typeBus, numberSeat: parseInt(values.typeBus.split(" ").pop()) }
        }
        if (values?.typeSeat !== bus?.typeSeat) data = { ...data, typeSeat: values?.typeSeat }
        if (values?.floorNumber === '1') data = { ...data, floorNumber: 1 }
        else data = { ...data, floorNumber: 2 }
        if (avatarFile) data = { ...data, avatar: avatarFile }
        if (newImages?.length > 0) { data = { ...data, images: images, newImages: newImages } }
        if (deleteImages?.length > 0) { data = { ...data, images: images > 0 ? images : 'null', deleteImages: deleteImages } }
        if (Object.keys(data)?.length > 0) {
            mutation.mutate({ ...data, id: bus?.id, access_token })
            setAvatarFile('')
            loadingMes()
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
            },
            onSuccess: (data) => {
                successMes(data.message)
                refetch()

            },
            onError: (data) => {
                errorMes(data?.response?.data?.message)
            }
        }
    )

    const handleDeleteBus = () => {
        mutationDelete.mutate({ id: bus.id, access_token })
        loadingMes()
    }

    const confirm = () => {
        handleDeleteBus()
    };

    const onChange = (value) => {
        if (value === 'Khác') {
            setVisible(true)
        } else setVisible(false)
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

    console.log('fileList', fileList);
    return (
        <>
            <div style={{ overflowY: 'auto', width: '100%', backgroundColor: '#d5f0d9', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '0px 20px' }}>
                <Form
                    ref={formRef}
                    form={form}
                    onFinish={onFinish}
                    style={{ height: 'calc(85vh - 40px)' }}

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
                            // onSearch={onSearch}
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

                    <Form.Item name="typeSeat">
                        <Radio.Group>
                            <Radio value="Sitting">Ghế ngồi</Radio>
                            <Radio value="Sleeper">Ghế giường nằm</Radio>
                            <Radio value="Massage">Ghế massage</Radio>
                            <Radio value="BusinessClass">Ghế thương gia</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        name="floorNumber"
                    >
                        <Radio.Group >
                            <Radio value="1">1 tầng</Radio>
                            <Radio value="2">2 tầng</Radio>
                        </Radio.Group>
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
                    title="Bạn có chắc chắn muốn xóa xe?"
                    description={<div style={{ color: 'red', width: '300px' }}>! Lưu ý: Các chuyến sắp tới của xe này sẽ được cập nhật. Bạn cần kiểm tra lại.</div>}
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