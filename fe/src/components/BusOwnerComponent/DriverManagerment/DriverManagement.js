import React, { useEffect, useState } from 'react'
import { Row, Col, Button } from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';

import { Avatar, Divider, List, Skeleton } from 'antd';
import DrawerCreateDriver from './DrawerCreateDriver';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getDriversByBusOwner } from '../../../services/DriverService';
import DriverInformation from './DriverInformation';
const DriverManagement = () => {
    const [open, setOpen] = useState(false);
    const user = useSelector((state) => state.user)
    const [listDriver, setListDriver] = useState([]);
    const [driverSelected, setDriverSelected] = useState();
    const [isloading, setIsLoading] = useState(false);


    const { data, isSuccess, isError, refetch } = useQuery(
        {
            queryKey: ['drivers'],
            queryFn: () => getDriversByBusOwner(user?.access_token, JSON.parse(localStorage.getItem('bus_owner_id'))),
            staleTime: Infinity
        });
    console.log('JSON.parse(localStorage.getIt', JSON.parse(localStorage.getItem('bus_owner_id')));
    useEffect(() => {
        if (isSuccess) {
            setListDriver(data?.data)
            setDriverSelected(data?.data[0])
        } else if (isError) {
            console.log('err', data);
        }
    }, [isSuccess, isError, data])

    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    const handleClickDriver = (driver) => {
        console.log(driver);
        setDriverSelected(driver);
    }



    return (
        <div style={{ marginTop: '20px', padding: '0 20px' }}>
            <Row justify="space-between">
                <div>
                </div>
                <div>
                    <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', marginBottom: '20px', marginRight: '60px' }}>
                        Thêm tài xế
                    </Button>
                </div>
            </Row>
            <Row justify="space-around" style={{ height: '80vh' }}>
                <Col span={10} style={{}}>
                    <DriverInformation driver={driverSelected} access_token={user?.access_token} refetch={refetch}></DriverInformation>

                </Col>
                <Col span={10} style={{ height: '100%', overflowY: 'auto' }}>
                    {
                        listDriver?.map((driver) => (
                            <div onClick={() => handleClickDriver(driver)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid black', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', backgroundColor: driverSelected === driver ? '#c6e7f5' : '#f0f0f0', padding: '10px' }}>
                                {driver?.user?.avatar ? <Avatar src={driver?.user?.avatar} size={64} style={{ marginRight: '20px' }} /> : <UserOutlined style={{ marginRight: '20px', fontSize: '50px', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'gray', display: 'flex', justifyContent: 'center' }}></UserOutlined>}
                                <div>
                                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff', textDecoration: 'none' }}>{driver?.user?.name}</div>
                                    <p style={{ color: '#555' }}>{driver?.user?.email}</p>
                                </div>
                            </div>
                        ))
                    }
                </Col>
            </Row>
            <DrawerCreateDriver open={open} onClose={onClose} refetch={refetch}></DrawerCreateDriver>
        </div>
    )
}

export default DriverManagement