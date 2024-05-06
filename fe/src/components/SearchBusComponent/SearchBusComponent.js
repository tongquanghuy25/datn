import React, { useEffect, useState } from 'react'
import banner from '../../acess/banner1.jpg'
import { Button, DatePicker, Select } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAllProvince, getDistrictByProvince } from '../../services/PlaceService'
import dayjs from 'dayjs';
import { errorMes } from '../Message/Message'


const SearchBusComponent = (props) => {
    const { handleSearch } = props

    const queryClient = useQueryClient();

    const [listProvince, setListProvince] = useState([])
    const [listDistrictStart, setListDistrictStart] = useState([])
    const [listDistrictEnd, setListDistrictEnd] = useState([])
    const [provinceStart, setProvinceStart] = useState();
    const [provinceEnd, setProvinceEnd] = useState();
    const [districtStart, setDistrictStart] = useState();
    const [districtEnd, setDistrictEnd] = useState();
    const [date, setDate] = useState();


    //Get All Province
    const { data } = useQuery(
        {
            queryKey: ['provinces'],
            queryFn: () => getAllProvince(),
            staleTime: Infinity
        });

    useEffect(() => {
        const listData = data?.data?.map((province) => ({
            value: province._id,
            label: province.name,
        }));
        setListProvince(listData);
    }, [data])

    //Select District Start and Province Start
    const mutationStart = useMutation({
        mutationFn: async (data) => {
            const { provinceId } = data;
            return await getDistrictByProvince(provinceId);
        }
    });

    const { data: dataDistrictStart } = mutationStart

    useEffect(() => {
        queryClient.setQueryData(provinceStart, dataDistrictStart?.data);
        const listData = dataDistrictStart?.data?.map((district) => ({
            value: district._id,
            label: district.name,
        }));
        setListDistrictStart(listData)
    }, [dataDistrictStart])

    const getListDistrictStart = (provinceId) => {
        const cacheDistrict = queryClient.getQueryData(listProvince[provinceId - 1].label)

        if (cacheDistrict?.length > 0) {
            const listData2 = cacheDistrict?.map((district) => ({
                value: district._id,
                label: district.name,
            }));
            setListDistrictStart(listData2)
        } else mutationStart.mutate({ provinceId })
    }

    const onChangeProvinceStart = (value) => {
        setProvinceStart(listProvince[value - 1].label)
        getListDistrictStart(value)
    };

    const onChangeDistrictStart = (value) => {
        setDistrictStart(listDistrictStart.find(item => item.value === value).label)
    }


    //Select Province End And District End
    const mutationEnd = useMutation({
        mutationFn: async (data) => {
            const { provinceId } = data;
            return await getDistrictByProvince(provinceId);
        }
    });

    const { data: dataDistrictEnd } = mutationEnd

    useEffect(() => {
        queryClient.setQueryData(provinceEnd, dataDistrictEnd?.data);
        const listData3 = dataDistrictEnd?.data?.map((district) => ({
            value: district._id,
            label: district.name,
        }));
        setListDistrictEnd(listData3)
    }, [dataDistrictEnd])

    const getListDistrictEnd = (provinceId) => {
        const cahceDistrict = queryClient.getQueryData(listProvince[provinceId - 1].label)
        if (cahceDistrict?.length > 0) {
            const listData4 = cahceDistrict?.map((district) => ({
                value: district._id,
                label: district.name,
            }));
            setListDistrictEnd(listData4)
        } else mutationEnd.mutate({ provinceId })
    }

    const onChangeProvinceEnd = (value) => {
        setProvinceEnd(listProvince[value - 1].label)
        getListDistrictEnd(value)
    };

    const onChangeDistrictEnd = (value) => {
        setDistrictEnd(listDistrictEnd.find(item => item.value === value).label)
    }

    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const onChangeDate = (date, dateString) => {
        setDate(dateString)
    }



    const onSearch = () => {
        if (provinceStart && provinceEnd && date) {
            console.log(date);
            handleSearch({ provinceStart, provinceEnd, districtStart, districtEnd, date })
        } else errorMes('Vui lòng nhập đầy đủ thông tin!')
    }

    return (
        <div
            style={{
                background: 'linear-gradient(135deg, #3494e6, #ec6ead)', /* Gradient màu từ xanh dương đến hồng */
                padding: '20px' /* Thêm padding cho nội dung bên trong */
            }}
        >
            <div style={{ width: '50%', margin: 'auto' }}>
                <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Nơi đi</div>
                    <Select style={{ width: '40%' }}
                        showSearch
                        placeholder="Chọn tỉnh"
                        onChange={onChangeProvinceStart}
                        filterOption={filterOption}
                        options={listProvince}
                    />
                    <Select style={{ width: '40%', marginLeft: '10px' }}
                        showSearch
                        placeholder="Chọn huyện"
                        onChange={onChangeDistrictStart}
                        filterOption={filterOption}
                        options={listDistrictStart}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Nơi đến</div>
                    <Select style={{ width: '40%' }}
                        showSearch
                        placeholder="Chọn tỉnh"
                        onChange={onChangeProvinceEnd}
                        filterOption={filterOption}
                        options={listProvince}
                    />
                    <Select style={{ width: '40%', marginLeft: '10px' }}
                        showSearch
                        placeholder="Chọn huyện"
                        onChange={onChangeDistrictEnd}
                        filterOption={filterOption}
                        options={listDistrictEnd}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Chọn ngày</div>
                    <DatePicker
                        // multiple
                        format='DD/MM/YYYY'
                        // minDate={dayjs()}
                        // defaultValue={dayjs()}
                        placeholder='Chọn ngày'
                        onChange={onChangeDate}
                    />
                </div>

                <div>
                    <Button type="primary" onClick={onSearch}>Tìm chuyến</Button>
                </div>
            </div>
        </div>
    )
}

export default SearchBusComponent