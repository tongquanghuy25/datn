import React, { useState } from 'react'
import './style.css'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import FooterComponent from '../../components/FooterComponent/FooterComponent'
import { Col, Radio, Row, Space, InputNumber, Slider, Checkbox, Rate, Select, DatePicker, Button } from 'antd'
import { Option } from 'antd/es/mentions'
import BusCard from '../../components/BusCard/BusCard'
import SearchBusComponent from '../../components/SearchBusComponent/SearchBusComponent'
import { useMutation } from '@tanstack/react-query'
import { errorMes } from '../../components/Message/Message'
import { getTripsBySearch } from '../../services/TripService'
import SideBarFilterComponent from '../../components/SideBarFilterComponent/SideBarFilterComponent'
import { getPlacesBySearchTrip } from '../../services/RouteService'
const HomePage = () => {


    const [listTrip, setListTrip] = useState([])
    const [listPlace, setListPlace] = useState({})
    const [data, setData] = useState()

    const mutationGetList = useMutation({
        mutationFn: async (data) => {
            return await getTripsBySearch(data);
        },
        onSuccess: (data) => {
            // console.log('dataaaaaaa111', data);
            setListTrip(data?.data)
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
            // successMes(data.message)
            // console.log('data', data);
            setListPlace(data?.data)

        }
    });

    const handleSearch = (data) => {
        mutationGetList.mutate(data)
        mutationGetInforFilter.mutate(data)
        setData(data)
    }

    //FILTER


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


    return (
        <div>
            <HeaderComponent></HeaderComponent>
            <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <SearchBusComponent handleSearch={handleSearch}></SearchBusComponent>


                <div style={{ backgroundColor: 'white', width: '80%' }}>
                    <Row>
                        <SideBarFilterComponent data={data} listPlace={listPlace}></SideBarFilterComponent>
                        <Col span={18} style={{}}>
                            <div style={{ overflowY: 'auto' }}>
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