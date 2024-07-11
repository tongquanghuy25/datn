import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { getAllBusOwnerNotAccept, getAllPartnerNotAccept } from '../../services/PartnerSevice';
import BusOwnerCard from '../BusOwnerCard/BusOwnerCard';
import { Col, Row } from 'antd';
import nodata from '../../acess/nodata.jpg'

const AcceptPartner = () => {
    const user = useSelector((state) => state.user);
    const [partnerNotAccept, setPartnerNotAccept] = useState([])

    const { data, isSuccess, isError, refetch } = useQuery(
        {
            queryKey: ['busOwnerNotAccept'],
            queryFn: () => getAllPartnerNotAccept(user?.access_token),
        });

    useEffect(() => {
        if (isSuccess) {
            setPartnerNotAccept(data?.data)
        } else if (isError) {
            console.log('err', data);
        }

    }, [isSuccess, isError, data])


    return (
        <div >
            <Row justify={'center'}>
                <h1>Danh sách đối tác chờ phê duyệt</h1>
            </Row>
            {
                partnerNotAccept.length ?
                    <div style={{ overflowY: 'auto', maxHeight: 'calc(80vh)' }}>
                        {partnerNotAccept.map((data) =>
                            <BusOwnerCard key={data.id} data={data} access_token={user?.access_token} refetch={refetch}></BusOwnerCard>

                        )}
                    </div>
                    :
                    <div span={18} align="middle" style={{}}>
                        <img src={nodata} style={{ width: '400px', marginTop: 50 }}></img>
                        <h2>Chưa có đối tác nào đang chờ phê duyệt</h2>
                    </div>
            }
        </div>
    )
}

export default AcceptPartner