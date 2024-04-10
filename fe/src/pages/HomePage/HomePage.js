import React, { useState } from 'react'
import './style.css'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import FooterComponent from '../../components/FooterComponent/FooterComponent'
import background from '../../acess/background.jpg'
import { Col, Radio, Row, Space, InputNumber, Slider, Checkbox, Rate, Select, DatePicker, Button } from 'antd'
import { Option } from 'antd/es/mentions'
import BusCard from '../../components/BusCard/BusCard'
const HomePage = () => {

    const [pickupProvince, setPickupProvince] = useState('');
    const [pickupDistrict, setPickupDistrict] = useState('');
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffProvince, setDropoffProvince] = useState('');
    const [dropoffDistrict, setDropoffDistrict] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);

    const disabledDate = current => {
        // Lấy ngày hôm nay
        const today = new Date();
        // Chỉ cho phép chọn từ ngày hôm nay trở đi
        return current && current < today.setHours(0, 0, 0, 0);
    };


    const handleProvinceChange = (value, type) => {
        if (type === 'pickup') {
            setPickupProvince(value);
        } else {
            setDropoffProvince(value);
        }
    };

    const handleDistrictChange = (value, type) => {
        if (type === 'pickup') {
            setPickupDistrict(value);
        } else {
            setDropoffDistrict(value);
        }
    };

    const handleLocationChange = (value, type) => {
        if (type === 'pickup') {
            setPickupLocation(value);
        } else {
            setDropoffLocation(value);
        }
    };

    const handleDateChange = (date, dateString) => {
        setSelectedDate(dateString);
    };

    const handleSearch = () => {
        // Xử lý tìm chuyến
        console.log('Đã bắt đầu tìm chuyến');
    };


    const [value, setValue] = useState();
    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };


    const [priceRange, setPriceRange] = useState([1000, 2000000]); // Giá trị mặc định của khoảng giá

    const handlePriceRangeChange = value => {
        setPriceRange(value);
    };

    const handleInputNumberChange = (index, value) => {
        const newPriceRange = [...priceRange];
        newPriceRange[index] = value;
        setPriceRange(newPriceRange);
    };


    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleCheckboxChange = checkedValues => {
        setSelectedOptions(checkedValues);
        console.log('checkedValues', checkedValues);
    };

    const [selectedRatings, setselectedRatings] = useState('');
    const onChangeStar = e => {
        setselectedRatings(e.target.value);
    };

    const buss = [
        {
            id: 1,
            name: 'Xe A',
            avatar: 'url/to/avatar',
            rating: 4,
            departureTime: '08:00',
            departureLocation: 'Hà Nội',
            arrivalTime: '12:00',
            arrivalLocation: 'Hồ Chí Minh',
            price: '500000',
            availableSeats: 3
        },
        {
            id: 2,
            name: 'Xe B',
            avatar: 'url/to/avatar',
            rating: 5,
            departureTime: '09:00',
            departureLocation: 'Hồ Chí Minh',
            arrivalTime: '13:00',
            arrivalLocation: 'Đà Nẵng',
            price: '400000',
            availableSeats: 2
        }, {
            id: 4,
            name: 'Xe B',
            avatar: 'url/to/avatar',
            rating: 5,
            departureTime: '09:00',
            departureLocation: 'Hồ Chí Minh',
            arrivalTime: '13:00',
            arrivalLocation: 'Đà Nẵng',
            price: '400000',
            availableSeats: 2
        }, {
            id: 5,
            name: 'Xe B',
            avatar: 'url/to/avatar',
            rating: 5,
            departureTime: '09:00',
            departureLocation: 'Hồ Chí Minh',
            arrivalTime: '13:00',
            arrivalLocation: 'Đà Nẵng',
            price: '400000',
            availableSeats: 2
        }, {
            id: 6,
            name: 'Xe B',
            avatar: 'url/to/avatar',
            rating: 5,
            departureTime: '09:00',
            departureLocation: 'Hồ Chí Minh',
            arrivalTime: '13:00',
            arrivalLocation: 'Đà Nẵng',
            price: '400000',
            availableSeats: 2
        },
        // Thêm các đối tượng xe khác nếu cần
    ];


    // const selectedDates = '2024-04-05';
    // const selectedTimes = '15:30';
    // const dateTimeString = `${selectedDates}T${selectedTimes}`;
    // const endTime = new Date(dateTimeString);
    // const startTime = new Date('2024-04-04T12:00:00');

    // // Tính toán khoảng cách giờ giữa startTime và endTime
    // const diffMilliseconds = Math.abs(endTime - startTime); // Khoảng cách thời gian tính bằng mili giây
    // const diffHours = diffMilliseconds / (1000 * 60 * 60); // Khoảng cách thời gian tính bằng giờ

    // console.log('Khoảng cách giờ giữa hai thời điểm:', diffHours);

    return (
        <div>
            <HeaderComponent></HeaderComponent>
            <div style={{ backgroundColor: '#dce6b5', minHeight: '100vh', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <div style={{ backgroundImage: `url(${background})`, backgroundRepeat: 'no-repeat', objectFit: 'cover', height: '50vh', width: '80%' }}>
                    <div style={{ width: '50%', margin: 'auto' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <h3>Địa điểm đón</h3>
                            <Select style={{ width: '30%' }} placeholder="Tỉnh" onChange={value => handleProvinceChange(value, 'pickup')}>
                                <Option value="province1">Tỉnh 1</Option>
                                <Option value="province2">Tỉnh 2</Option>
                                {/* Các tùy chọn tỉnh khác */}
                            </Select>
                            <Select style={{ width: '30%', marginLeft: '10px' }} placeholder="Huyện" onChange={value => handleDistrictChange(value, 'pickup')}>
                                <Option value="district1">Huyện 1</Option>
                                <Option value="district2">Huyện 2</Option>
                                {/* Các tùy chọn huyện khác */}
                            </Select>
                            <Select style={{ width: '30%', marginLeft: '10px' }} placeholder="Địa điểm chi tiết" onChange={value => handleLocationChange(value, 'pickup')}>
                                <Option value="location1">Địa điểm 1</Option>
                                <Option value="location2">Địa điểm 2</Option>
                                {/* Các tùy chọn địa điểm khác */}
                            </Select>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <h3>Địa điểm trả</h3>
                            <Select style={{ width: '30%' }} placeholder="Tỉnh" onChange={value => handleProvinceChange(value, 'dropoff')}>
                                <Option value="province1">Tỉnh 1</Option>
                                <Option value="province2">Tỉnh 2</Option>
                                {/* Các tùy chọn tỉnh khác */}
                            </Select>
                            <Select style={{ width: '30%', marginLeft: '10px' }} placeholder="Huyện" onChange={value => handleDistrictChange(value, 'dropoff')}>
                                <Option value="district1">Huyện 1</Option>
                                <Option value="district2">Huyện 2</Option>
                                {/* Các tùy chọn huyện khác */}
                            </Select>
                            <Select style={{ width: '30%', marginLeft: '10px' }} placeholder="Địa điểm chi tiết" onChange={value => handleLocationChange(value, 'dropoff')}>
                                <Option value="location1">Địa điểm 1</Option>
                                <Option value="location2">Địa điểm 2</Option>
                                {/* Các tùy chọn địa điểm khác */}
                            </Select>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <h3>Chọn ngày</h3>
                            <DatePicker style={{ width: '100%' }} disabledDate={disabledDate} onChange={handleDateChange} />
                        </div>
                        <div>
                            <Button type="primary" onClick={handleSearch}>Tìm chuyến</Button>
                        </div>
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', width: '80%', height: '100vh' }}>
                    <Row>
                        <Col span={6} style={{ height: '100vh' }}>
                            <div style={{ marginLeft: '20px' }}>
                                <h2>Sắp xếp</h2>
                                <Radio.Group >
                                    <Space direction="vertical"
                                        onChange={onChange}
                                        value={value}
                                    >
                                        <Radio value={1} className='text-radio'>Giá tăng dần</Radio>
                                        <Radio value={2} className='text-radio'>Giá giảm dần</Radio>
                                        <Radio value={3} className='text-radio'>Giờ đi sớm nhất</Radio>
                                        <Radio value={4} className='text-radio'>Giờ đi muộn nhất</Radio>

                                    </Space>
                                </Radio.Group>
                            </div>

                            <div style={{ marginLeft: '20px' }}>
                                <h2>Chọn khoảng giá </h2>
                                <Slider
                                    range
                                    min={1000}
                                    max={2000000}
                                    step={100}
                                    value={typeof priceRange[0] === 'number' && typeof priceRange[0] === 'number' ? priceRange : [1000, 2000000]}
                                    onChange={handlePriceRangeChange}
                                />
                                <InputNumber
                                    style={{ margin: '16px 16px 16px 0' }}
                                    min={1000}
                                    max={2000000}
                                    value={priceRange[0]}
                                    onChange={value => handleInputNumberChange(0, value)}
                                />
                                <span style={{ marginRight: '10px' }}>đến</span>
                                <InputNumber
                                    style={{ margin: '16px 16px 16px 0' }}
                                    min={1000}
                                    max={2000000}
                                    value={priceRange[1]}
                                    onChange={value => handleInputNumberChange(1, value)}
                                />
                                <span style={{ fontWeight: 'bold' }}>đ</span>

                            </div>

                            <div style={{ marginLeft: '20px' }}>
                                <h2>Chọn loại nội thất:</h2>
                                <Checkbox.Group onChange={handleCheckboxChange} value={selectedOptions}>
                                    <Checkbox value="seat">Ghế ngồi</Checkbox>
                                    <Checkbox value="bed">Giường nằm</Checkbox>
                                </Checkbox.Group>
                            </div>

                            <div style={{ marginLeft: '20px' }}>
                                <h2>Chọn loại đánh giá:</h2>
                                <Radio.Group >
                                    <Space direction="vertical"
                                        onChange={onChangeStar}
                                    // value={value}
                                    >
                                        <Radio value="3star" className='text-radio'><Rate disabled defaultValue={3} />  3 sao</Radio>
                                        <Radio value="4star" className='text-radio'><Rate disabled defaultValue={4} />  4 sao</Radio>
                                        <Radio value="5star" className='text-radio'><Rate disabled defaultValue={5} />  5 sao</Radio>

                                    </Space>
                                </Radio.Group>
                            </div>
                        </Col>
                        <Col span={18} style={{ height: '100vh' }}>
                            <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh)' }}>
                                {buss.map(bus => (
                                    <BusCard key={bus.id} bus={bus} />
                                ))}
                            </div>
                        </Col>

                    </Row>
                </div>


            </div>

            <FooterComponent></FooterComponent>
        </div>
    )
}

export default HomePage