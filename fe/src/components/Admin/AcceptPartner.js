import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { getAllBusOwnerNotAccept, getAllPartnerNotAccept } from '../../services/PartnerSevice';
import BusOwnerCard from '../BusOwnerCard/BusOwnerCard';
import { Row } from 'antd';

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
            // console.log(data?.data);
            setPartnerNotAccept(data?.data)
        } else if (isError) {
            console.log('err', data);
        }

    }, [isSuccess, isError, data])


    return (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(80vh)' }}>
            <Row justify={'center'}>
                <h1>Danh sách đối tác chờ phê duyệt</h1>
            </Row>
            {
                partnerNotAccept.map((data) =>
                    <BusOwnerCard key={data.id} data={data} access_token={user?.access_token} refetch={refetch}></BusOwnerCard>

                )
            }
        </div>
    )
}

export default AcceptPartner