import { Avatar, Button, Col, Image, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { PlusOutlined, CarOutlined, StarOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import DrawerCreateBus from './DrawerCreateBus';
import { useQuery } from '@tanstack/react-query';
import { getBussByBusOwner } from '../../../services/BusService';
import BusInformation from './BusInformation';




const BusManagerment = () => {
    const [open, setOpen] = useState(false);
    const user = useSelector((state) => state.user)
    const [listBus, setListBus] = useState([]);
    const [busSelected, setBusSelected] = useState();



    const { data, isSuccess, isError, refetch } = useQuery(
        {
            queryKey: ['buss'],
            queryFn: () => getBussByBusOwner(user?.access_token, JSON.parse(localStorage.getItem('bus_owner_id'))),
        });

    useEffect(() => {
        if (isSuccess) {
            setListBus(data?.data)
            setBusSelected(data?.data[0])
        } else if (isError) {
            console.log('err', data);
        }
    }, [isSuccess, isError, data])

    const handleClickBus = (bus) => {
        setBusSelected(bus);
    }

    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    return (
        <div>
            <Row justify="space-between">

            </Row>
            {listBus &&
                <Row justify="space-around" style={{ height: '80vh' }}>
                    <Col span={10} >
                        <BusInformation bus={busSelected} access_token={user.access_token} refetch={refetch}></BusInformation>
                    </Col>
                    <Col span={10} style={{ height: '100%', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3>Danh sách xe</h3>
                            <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', marginBottom: '20px' }}>
                                Thêm xe
                            </Button>
                        </div>
                        {
                            listBus?.map((bus) =>
                                <>

                                    <div onClick={() => handleClickBus(bus)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid black', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', backgroundColor: busSelected === bus ? '#c6e7f5' : '#f0f0f0', padding: '10px', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', }}>
                                            {bus.avatar ? <img src={bus.avatar} style={{ width: '64px', height: '64px', borderRadius: '5px', marginRight: '20px', objectFit: 'cover' }} /> : <CarOutlined style={{ marginRight: '20px', fontSize: '50px', width: '64px', height: '64px', borderRadius: '5px', backgroundColor: 'gray', display: 'flex', justifyContent: 'center' }}></CarOutlined>}
                                            <div>
                                                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff', textDecoration: 'none' }}>{bus.licensePlate}</div>
                                                <p style={{ color: '#555', fontWeight: '500' }}>{bus.typeBus} chỗ</p>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '16px', marginLeft: '100px', fontWeight: '500' }}>Đánh giá : {bus.averageRating} <StarOutlined style={{ color: 'red' }} /></div>

                                    </div>

                                </>


                            )
                        }
                    </Col>
                </Row>
            }
            <DrawerCreateBus open={open} onClose={onClose} refetch={refetch}></DrawerCreateBus>
        </div>
    )
}

export default BusManagerment