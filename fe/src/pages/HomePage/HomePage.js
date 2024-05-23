import React, { useState } from 'react'
import './style.css'
import nodata from '../../acess/nodata.jpg'
import intro from '../../acess/intro.jpg'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import FooterComponent from '../../components/FooterComponent/FooterComponent'
import { Col, Radio, Row, Space, InputNumber, Slider, Checkbox, Rate, Select, DatePicker, Button } from 'antd'
import { Option } from 'antd/es/mentions'
import BusCard from '../../components/BusCard/TripCard'
import SearchBusComponent from '../../components/SearchBusComponent/SearchBusComponent'
import { useMutation } from '@tanstack/react-query'
import { errorMes } from '../../components/Message/Message'
import { getTripsBySearch } from '../../services/TripService'
import SideBarFilterComponent from '../../components/SideBarFilterComponent/SideBarFilterComponent'
import { getPlacesBySearchTrip } from '../../services/RouteService'
const HomePage = () => {


    const [listTrip, setListTrip] = useState([])
    const [listPlace, setListPlace] = useState({})
    const [dataSearch, setDataSearch] = useState()
    const [isSearch, setIsSearch] = useState(false)


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
        const arrivalTime = `${arrivalHour}:${formattedArrivalMinute}`;

        // Định dạng thời gian xuất phát
        const formattedStartMinute = startMinute.toString().padStart(2, '0'); // Thêm số 0 phía trước nếu cần
        const departureTime = `${startHour}:${formattedStartMinute}`;

        return { departureTime, arrivalTime };
    }

    const mutationGetList = useMutation({
        mutationFn: async (data) => {
            return await getTripsBySearch(data);
        },
        onSuccess: (data) => {
            console.log('a', data?.data);
            const listData = data.data?.map(trip => {
                const { departureTime, arrivalTime } = calculateArrivalTime(trip.departureTime, trip.routeId.journeyTime)
                return {
                    _id: trip._id,
                    busOwnerId: trip.busOwnerId._id,
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
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    });



    const mutationGetInforFilter = useMutation({
        mutationFn: async (data) => {
            return await getPlacesBySearchTrip(data);
        },
        onSuccess: (data) => {
            setListPlace(data?.data)
        }
    });

    const handleSearch = (data) => {
        mutationGetList.mutate(data)
        mutationGetInforFilter.mutate(data)
        setDataSearch(data)
        setIsSearch(true)
    }

    const handleCancelFilter = (data) => {
        mutationGetList.mutate(data)
    }

    return (
        <div>
            <HeaderComponent></HeaderComponent>
            <div style={{ backgroundColor: '#f0f2f5', display: 'flex', minHeight: '100vh', alignItems: 'center', flexDirection: 'column' }}>
                <div style={{ backgroundColor: 'white', width: '80%' }}>
                    <SearchBusComponent handleSearch={handleSearch}></SearchBusComponent>

                    {isSearch &&
                        <Row style={{ marginBottom: '20px' }}>
                            <SideBarFilterComponent dataSearch={dataSearch} listPlace={listPlace} setListTrip={setListTrip} handleCancelFilter={handleCancelFilter}></SideBarFilterComponent>
                            {
                                listTrip.length > 0 ?
                                    <Col span={18} style={{}}>
                                        <div style={{ overflowY: 'auto' }}>
                                            {listTrip.map(trip => (
                                                <BusCard key={trip.id} trip={trip} />
                                            ))}
                                        </div>
                                    </Col>
                                    :
                                    <Col span={18} align="middle" style={{}}>
                                        <img src={nodata} style={{ maxWidth: '400px' }}></img>
                                        <h2>Chưa có chuyến xe nào phù hợp</h2>
                                    </Col>
                            }

                        </Row>
                    }
                    {!isSearch &&
                        <Row justify={'center'} style={{ textAlign: 'center' }}>
                            <div style={{ maxWidth: '400px' }}>
                                <img src={intro} style={{ width: '100%', height: 'auto' }} alt="Introduction"></img>
                                <p style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif', color: '#666' }}>Nhanh tay chọn ngay chuyến xe cho mình nào!</p>
                            </div>
                        </Row>
                    }

                    <div class="seo-content">

                        <div class="card">
                            <div class="icon-container">
                                <img class=" lazyloaded" data-src="https://229a2c9fe669f7b.cmccloud.com.vn/svgIcon/bus-car-icon.svg" src="https://229a2c9fe669f7b.cmccloud.com.vn/svgIcon/bus-car-icon.svg" alt="busCar-icon" />
                            </div>
                            <div class="card-content">
                                <p class="card-content-title">Nhà xe chất lượng cao</p>
                                <p class="card-content-text">Các tuyến đường trên toàn quốc, chủ động và đa dạng lựa chọn.</p>
                            </div>
                        </div>

                        <div class="card">
                            <div class="icon-container">
                                <img class=" lazyloaded" data-src="https://229a2c9fe669f7b.cmccloud.com.vn/svgIcon/yellow-ticket-icon.svg" src="https://229a2c9fe669f7b.cmccloud.com.vn/svgIcon/yellow-ticket-icon.svg" alt="easybook-icon" />
                            </div>
                            <div class="card-content">
                                <p class="card-content-title">Đặt vé dễ dàng</p>
                                <p class="card-content-text">Đặt vé chỉ với 60s. Chọn xe yêu thích cực nhanh và thuận tiện.</p>
                            </div>
                        </div>

                        <div class="card">
                            <div class="icon-container">
                                <img class=" lazyloaded" data-src="https://229a2c9fe669f7b.cmccloud.com.vn/svgIcon/completement-icon.svg" src="https://229a2c9fe669f7b.cmccloud.com.vn/svgIcon/completement-icon.svg" alt="guarantee-icon" />
                            </div><div class="card-content">
                                <p class="card-content-title">Đảm bảo có vé</p>
                                <p class="card-content-text">Hoàn ngay nếu không có vé, mang đến hành trình trọn vẹn.</p>
                            </div>
                        </div>

                        <div class="card">
                            <div class="icon-container"><img class=" lazyloaded" data-src="https://229a2c9fe669f7b.cmccloud.com.vn/svgIcon/coupon-icon.svg" src="https://229a2c9fe669f7b.cmccloud.com.vn/svgIcon/coupon-icon.svg" alt="deal-icon" />
                            </div>
                            <div class="card-content">
                                <p class="card-content-title">Nhiều ưu đãi</p>
                                <p class="card-content-text">Rất nhiều ưu đãi, tiện ích được đem đến cho người dùng.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <FooterComponent></FooterComponent>
        </div>
    )
}

export default HomePage