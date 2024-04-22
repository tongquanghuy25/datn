import './style.css'
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, DatePicker, Select, Avatar, AutoComplete } from 'antd';
import { LoadingOutlined, PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { error, loading, success } from '../../components/Message';
import { useSelector } from 'react-redux'
import { busOwnerRegister } from '../../services/BusOwnerSevice';


// const { Option } = Select;

// const getBase64 = (img, callback) => {
//     const reader = new FileReader();
//     reader.addEventListener('load', () => callback(reader.result));
//     reader.readAsDataURL(img);
// };

// Danh sách các tỉnh
const provinces = [
    "Hà Nội",
    "Hồ Chí Minh",
    "Đà Nẵng",
    "Hải Phòng",
    "Cần Thơ",
    "An Giang",
    "Bà Rịa - Vũng Tàu",
    "Bắc Giang",
    "Bắc Kạn",
    "Bạc Liêu",
    "Bắc Ninh",
    "Bến Tre",
    "Bình Định",
    "Bình Dương",
    "Bình Phước",
    "Bình Thuận",
    "Cà Mau",
    "Cao Bằng",
    "Đắk Lắk",
    "Đắk Nông",
    "Điện Biên",
    "Đồng Nai",
    "Đồng Tháp",
    "Gia Lai",
    "Hà Giang",
    "Hà Nam",
    "Hà Tĩnh",
    "Hải Dương",
    "Hậu Giang",
    "Hòa Bình",
    "Hưng Yên",
    "Khánh Hòa",
    "Kiên Giang",
    "Kon Tum",
    "Lai Châu",
    "Lâm Đồng",
    "Lạng Sơn",
    "Lào Cai",
    "Long An",
    "Nam Định",
    "Nghệ An",
    "Ninh Bình",
    "Ninh Thuận",
    "Phú Thọ",
    "Quảng Bình",
    "Quảng Nam",
    "Quảng Ngãi",
    "Quảng Ninh",
    "Quảng Trị",
    "Sóc Trăng",
    "Sơn La",
    "Tây Ninh",
    "Thái Bình",
    "Thái Nguyên",
    "Thanh Hóa",
    "Thừa Thiên Huế",
    "Tiền Giang",
    "Trà Vinh",
    "Tuyên Quang",
    "Vĩnh Long",
    "Vĩnh Phúc",
    "Yên Bái"
];

const BusOwnerRegistration = () => {
    const [form] = Form.useForm();
    const user = useSelector((state) => state.user)
    // const [avatar, setAvatar] = useState('')
    const [isloading, setisLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [startPoint, setStartPoint] = useState([]);
    const [endPoint, setEndPoint] = useState([]);


    const navigate = useNavigate()

    const mutation = useMutation(
        {
            mutationFn: (data) => {
                const { access_token, ...rests } = data
                return busOwnerRegister(access_token, rests)
            }
        }
    )

    const { data, isSuccess, isError } = mutation

    useEffect(() => {
        if (isSuccess && data?.status === "OK") {
            success("Cập nhật người dùng thành công !");
        } else if (isError || data?.status === "ERR") {
            error(data?.message);
        }
    }, [isSuccess, isError])

    const onFinish = (values) => {
        loading()
        mutation.mutate({
            userId: user?.id,
            access_token: user?.access_token,
            busOwnerName: values?.busOwnerName,
            address: values.address,
            citizenId: values?.citizenId,
            route: `${startPoint} - ${endPoint}`
        });

    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    // const handleChange = (info) => {
    //     if (info.file.status === 'uploading') {
    //         setisLoading(true);
    //         return;
    //     }
    //     if (info.file.status === 'done') {
    //         getBase64(info.file.originFileObj, (url) => {
    //             setisLoading(false);
    //             setAvatar(url);
    //         });
    //     }
    // };


    // Hàm tạo gợi ý
    const handleSearch = (value) => {
        const filteredOptions = provinces.filter(option =>
            option.toLowerCase().includes(value.toLowerCase())
        );
        setOptions(filteredOptions.map(option => ({ value: option })));
    };

    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            {isloading ? <LoadingOutlined /> : <PlusOutlined />}
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
        <div style={{ backgroundColor: '#f0f2f5', flexDirection: 'column', width: '100%', height: '100vh', display: 'flex', alignItems: 'center' }}>
            <HeaderComponent></HeaderComponent>
            <Form
                form={form}
                name="register"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ width: '600px' }}
            >
                <Form.Item
                    style={{ marginBottom: '100px' }}
                    wrapperCol={{ offset: 8, span: 16 }}
                >
                    <h1>Đăng ký trở thành nhà xe</h1>
                </Form.Item>

                {/* <div offset={8} span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '50px' }}>
                    <h1>Đăng ký trở thành nhà xe</h1>
                </div> */}
                {/* <Form.Item
                    name="avatar"
                    label="Ảnh đại diện"
                // valuePropName="fileList"
                // getValueFromEvent={() => []}
                >
                    <Upload
                        name="avatar"
                        listType="picture-circle"
                        className="avatar-uploader"
                        showUploadList={false}
                        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                        onChange={handleChange}>
                        {avatar ? (
                            <img
                                src={avatar}
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
                </Form.Item> */}

                <Form.Item
                    name="busOwnerName"
                    label="Tên nhà xe"
                    rules={[{
                        required: true,
                        message: 'Không được bỏ trống'
                    }]}
                >
                    <Input />
                </Form.Item>

                {/* <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        {
                            type: 'email',
                            message: 'Email không đúng định dạng',
                        },
                        {
                            required: true,
                            message: 'Không được bỏ trống'
                        },
                    ]}
                >
                    <Input />
                </Form.Item> */}

                <Form.Item
                    name="address"
                    label="Địa chỉ"
                    rules={[{
                        required: true,
                        message: 'Không được bỏ trống'
                    }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="citizenId"
                    label="Căn Cước Công Dân"
                    rules={[{
                        required: true,
                        message: 'Không được bỏ trống'
                    }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Tuyến đường"
                    rules={[{
                        required: true,
                        message: 'Không được bỏ trống'
                    }]}
                >
                    <div style={{ display: 'flex' }}>
                        <AutoComplete
                            style={{ width: 200 }}
                            options={options}
                            onSearch={handleSearch}
                            onSelect={(value) => { setStartPoint(value); setOptions([]) }}
                            placeholder="Chọn tỉnh"
                        />
                        <ArrowRightOutlined style={{ marginLeft: '10px', marginRight: '10px' }} />
                        <AutoComplete
                            style={{ width: 200 }}
                            options={options}
                            onSearch={handleSearch}
                            onSelect={(value) => { setEndPoint(value); setOptions([]) }}
                            placeholder="Chọn tỉnh"
                        />
                    </div>
                </Form.Item>

                {/* <Form.Item
                    name="gender"
                    label="Giới tính"
                    rules={[{
                        required: true,
                        message: 'Không được bỏ trống'
                    }]}
                >
                    <Select>
                        <Option value="male">Nam</Option>
                        <Option value="female">Nữ</Option>
                        <Option value="other">Khác</Option>
                    </Select>
                </Form.Item>


                <Form.Item
                    name="birthday"
                    label="Ngày sinh"
                    rules={[{ required: true, message: 'Please select your birthday!' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item> */}

                <Form.Item style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }} wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Đăng ký
                    </Button>
                </Form.Item>

            </Form>
        </div>
    )
}

export default BusOwnerRegistration