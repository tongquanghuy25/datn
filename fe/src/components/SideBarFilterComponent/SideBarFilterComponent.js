import { useMutation } from '@tanstack/react-query';
import { Button, Checkbox, Col, InputNumber, Radio, Rate, Row, Slider, Space, TreeSelect } from 'antd'
import React, { useState } from 'react'
import { getTripsByFilter } from '../../services/TripService';

const { SHOW_PARENT } = TreeSelect;
// const treeData = [
//     {
//         title: 'Node1',
//         value: '0-0',
//         key: '0-0',
//         children: [
//             {
//                 title: 'Child Node1',
//                 value: '0-0-0',
//                 key: '0-0-0',
//             },
//         ],
//     },
//     {
//         title: 'Node2',
//         value: '0-1',
//         key: '0-1',
//         children: [
//             {
//                 title: 'Child Node3',
//                 value: '0-1-0',
//                 key: '0-1-0',
//             },
//             {
//                 title: 'Child Node4',
//                 value: '0-1-1',
//                 key: '0-1-1',
//             },
//             {
//                 title: 'Child Node5',
//                 value: '0-1-2',
//                 key: '0-1-2',
//             },
//         ],
//     },
// ];

function calculateArrivalTime(startTime, duration) {
    // Chuyển đổi chuỗi 'hh:mm' thành giờ và phút
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [durationHour, durationMinute] = duration.split(':').map(Number);

    // Tính toán thời gian đến
    let arrivalHour = startHour + durationHour;
    let arrivalMinute = startMinute + durationMinute;

    // Xử lý trường hợp khi phút vượt quá 60
    if (arrivalMinute >= 60) {
        arrivalHour += Math.floor(arrivalMinute / 60);
        arrivalMinute %= 60;
    }

    if (arrivalMinute > 24) {
        arrivalMinute = arrivalMinute % 24
    }

    // Định dạng thời gian đến
    const formattedArrivalMinute = arrivalMinute.toString().padStart(2, '0'); // Thêm số 0 phía trước nếu cần
    const arrivalTime = `${arrivalHour} giờ ${formattedArrivalMinute}`;

    // Định dạng thời gian xuất phát
    const formattedStartMinute = startMinute.toString().padStart(2, '0'); // Thêm số 0 phía trước nếu cần
    const departureTime = `${startHour} giờ ${formattedStartMinute}`;

    return { departureTime, arrivalTime };
}

const SideBarFilterComponent = (props) => {

    const { listPlace, data, setListTrip, handleCancelFilter } = props

    const [order, setOrder] = useState();
    const [priceRange, setPriceRange] = useState([1000, 2000000]);
    const [seatOption, setSeatOption] = useState([]);
    const [minRating, setMinRating] = useState('');



    const onChangeOrder = (e) => {
        setOrder(e.target.value);
    };



    const handlePriceRangeChange = value => {
        setPriceRange(value);
    };

    const handleInputNumberChange = (index, value) => {
        const newPriceRange = [...priceRange];
        newPriceRange[index] = value;
        setPriceRange(newPriceRange);
    };



    const handleCheckboxChange = checkedValues => {
        setSeatOption(checkedValues);
    };

    const onChangeStar = e => {
        setMinRating(e.target.value);
    };

    //tree select
    const [placesStart, setPlacesStart] = useState([]);
    const onChangeStart = (newValue) => {
        setPlacesStart(newValue);
    };

    const treeDataStart = listPlace?.listPlaceStart?.map(districtObj => ({
        title: Object.keys(districtObj)[0],
        value: Object.keys(districtObj)[0],
        key: Object.keys(districtObj)[0],
        children: districtObj[Object.keys(districtObj)[0]].map(location => ({
            title: location.place,
            value: location._id,
            key: location._id
        }))
    }));

    const tPropsStart = {
        treeData: treeDataStart,
        value: placesStart,
        onChange: onChangeStart,
        treeCheckable: true,
        showCheckedStrategy: SHOW_PARENT,
        placeholder: 'Please select',
        style: {
            width: '100%',
        },
    };

    //End
    const [placesEnd, setPlacesEnd] = useState([]);
    const onChangeEnd = (newValue) => {
        setPlacesEnd(newValue);
    };
    const treeDataEnd = listPlace?.listPlaceEnd?.map(districtObj => ({
        title: Object.keys(districtObj)[0],
        value: Object.keys(districtObj)[0],
        key: Object.keys(districtObj)[0],
        children: districtObj[Object.keys(districtObj)[0]].map(location => ({
            title: location.place,
            value: location._id,
            key: location._id
        }))
    }));

    const tPropsEnd = {
        treeData: treeDataEnd,
        value: placesEnd,
        onChange: onChangeEnd,
        treeCheckable: true,
        showCheckedStrategy: SHOW_PARENT,
        placeholder: 'Please select',
        style: {
            width: '100%',
        },
    };

    const handleGetResultPlace = (places, listPlace) => {
        const newResult = [];

        places.forEach(val => {
            const districtObj = listPlace?.find(item => Object.keys(item)[0] === val);
            if (districtObj) {
                // Nếu giá trị là một huyện
                const locations = districtObj[val];
                locations.forEach(location => {
                    newResult.push(location._id);
                });
            } else {
                // Nếu giá trị là một địa điểm
                newResult.push(val);
            }
        });
        return newResult;
    }



    const mutation = useMutation({
        mutationFn: async (data) => {
            return await getTripsByFilter(data);
        },
        onSuccess: (data) => {
            console.log('da', data?.data);
            const listData = data.data?.map(trip => {
                const { departureTime, arrivalTime } = calculateArrivalTime(trip.departureTime, trip.routeId.journeyTime)
                return {
                    _id: trip._id,
                    busOwnerName: trip.busOwnerId.busOwnerName,
                    avatar: trip.busId.avatar,
                    rating: trip.busId.averageRating,
                    reviewCount: trip.busId.reviewCount,
                    images: trip.busId.images,
                    convinients: trip.busId.convinients,
                    typeBus: trip.busId.typeBus,
                    availableSeats: `${trip.busId.numberSeat - trip.ticketsSold}/${trip.busId.numberSeat}`,
                    routeId: trip.routeId._id,
                    departureLocation: `${trip.routeId.districtStart} - ${trip.routeId.placeStart}`,
                    arrivalLocation: `${trip.routeId.districtEnd} - ${trip.routeId.placeEnd}`,
                    ticketPrice: trip.ticketPrice,
                    paymentRequire: trip.paymentRequire,
                    prebooking: trip.prebooking,
                    departureDate: trip.departureDate,
                    arrivalTime: arrivalTime,
                    departureTime: departureTime,
                }
            })
            setListTrip(listData)
        }
    });

    const handleConfirmFilter = () => {
        let result = { ...data }

        result.order = order
        result.priceRange = priceRange
        if (seatOption?.length === 1 && seatOption[0] === 'seat') {
            result.isRecliningSeat = false
        } else if (seatOption?.length === 1 && seatOption[0] === 'bed') {
            result.isRecliningSeat = true
        }

        result.minRating = minRating
        result.placesStart = handleGetResultPlace(placesStart, listPlace?.listPlaceStart)
        result.placesEnd = handleGetResultPlace(placesEnd, listPlace?.listPlaceEnd)

        mutation.mutate(result)
    }



    const handleClearFilter = () => {
        handleCancelFilter(data)
        setOrder()
        setPriceRange([1000, 2000000])
        setSeatOption([])
        setMinRating('')
        setPlacesStart([])
        setPlacesEnd([])
    }

    return (
        <Col span={6}>
            <div style={{ marginLeft: '20px' }}>
                <h2>Sắp xếp</h2>
                <Radio.Group value={order}>
                    <Space direction="vertical"
                        onChange={onChangeOrder}
                        value={order}
                    >
                        <Radio value='price_asc' className='text-radio'>Giá tăng dần</Radio>
                        <Radio value='price_desc' className='text-radio'>Giá giảm dần</Radio>
                        <Radio value='time_asc' className='text-radio'>Giờ đi sớm nhất</Radio>
                        <Radio value='time_desc' className='text-radio'>Giờ đi muộn nhất</Radio>

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
                <Checkbox.Group onChange={handleCheckboxChange} value={seatOption}>
                    <Checkbox value="seat">Ghế ngồi</Checkbox>
                    <Checkbox value="bed">Giường nằm</Checkbox>
                </Checkbox.Group>
            </div>

            <div style={{ marginLeft: '20px' }}>
                <h2>Chọn loại đánh giá:</h2>
                <Radio.Group
                    value={minRating}>
                    <Space direction="vertical"
                        onChange={onChangeStar}
                    >
                        <Radio value="3" className='text-radio'><Rate disabled defaultValue={3} />  3 sao</Radio>
                        <Radio value="4" className='text-radio'><Rate disabled defaultValue={4} />  4 sao</Radio>
                        <Radio value="5" className='text-radio'><Rate disabled defaultValue={5} />  5 sao</Radio>

                    </Space>
                </Radio.Group>
            </div>
            <div style={{ marginLeft: '20px' }}>
                <h2>Chọn điểm đi:</h2>
                <TreeSelect {...tPropsStart} />
            </div>

            <div style={{ marginLeft: '20px' }}>
                <h2>Chọn điểm đến:</h2>
                <TreeSelect {...tPropsEnd} />
            </div>

            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
                <Button type="primary" onClick={handleConfirmFilter} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', marginRight: '20px' }}>
                    Xác nhận lọc
                </Button>
                <Button type="primary" danger onClick={handleClearFilter} >
                    Xóa lọc
                </Button>
            </div>
        </Col>
    )
}

export default SideBarFilterComponent