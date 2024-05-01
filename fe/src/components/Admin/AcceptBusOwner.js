import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { getAllBusOwnerNotAccept } from '../../services/BusOwnerSevice';
import BusOwnerCard from '../BusOwnerCard/BusOwnerCard';

const AcceptBusOwner = () => {
    const user = useSelector((state) => state.user);
    const [busOwnerNotAccept, setBusOwnerNotAccept] = useState([])

    const { data, isSuccess, isError, refetch } = useQuery(
        {
            queryKey: ['busOwnerNotAccept'],
            queryFn: () => getAllBusOwnerNotAccept(user?.access_token),
        });

    useEffect(() => {
        if (isSuccess) {
            setBusOwnerNotAccept(data?.data)
        } else if (isError) {
            console.log('err', data);
        }

    }, [isSuccess, isError, data])


    return (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(80vh)' }}>
            {
                busOwnerNotAccept.map((data) =>
                    <BusOwnerCard key={data.id} data={data} access_token={user?.access_token} refetch={refetch}></BusOwnerCard>

                )
            }
        </div>
    )
}

export default AcceptBusOwner