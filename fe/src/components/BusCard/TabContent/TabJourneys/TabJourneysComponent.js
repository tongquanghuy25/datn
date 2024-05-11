import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { getStopPointsByBusRoute } from '../../../../services/RouteService';
import { Timeline } from 'antd';


function calculateTime(startTime, minutes) {
    console.log(startTime);
    const [startHour] = startTime?.split('giờ').map(str => parseInt(str.trim()));
    const totalMins = startHour * 60 + minutes;
    let endHours = Math.floor(totalMins / 60) % 24;
    let endMins = totalMins % 60;

    // Định dạng giờ và phút thành chuỗi 'hh:mm'
    const formattedHours = endHours < 10 ? `0${endHours}` : `${endHours}`;
    const formattedMins = endMins < 10 ? `0${endMins}` : `${endMins}`;

    return `${formattedHours}h${formattedMins}`;
}


const TabJourneysComponent = ({ departureTime, routeId }) => {
    const [listPickUpPoint, setListPickUpPoint] = useState([])
    const [listDropOffPoint, setListDropOffPoint] = useState([])

    console.log('departureTime', departureTime);
    // Get List Stop Point
    const { data: dataStopPoint } = useQuery(
        {
            queryKey: [`listStopPoint${routeId}`],
            queryFn: () => getStopPointsByBusRoute(routeId),
        });

    useEffect(() => {
        setListPickUpPoint(dataStopPoint?.data?.listPickUpPoint.sort((a, b) => a.timeFromStart - b.timeFromStart).map(item => {
            return { label: calculateTime(departureTime, item.timeFromStart), children: item.place }
        }))
        setListDropOffPoint(dataStopPoint?.data?.listDropOffPoint.sort((a, b) => a.timeFromStart - b.timeFromStart).map(item => {
            return { label: calculateTime(departureTime, item.timeFromStart), children: item.place }
        }))
    }, [dataStopPoint])
    console.log('listPickUpPoint', listPickUpPoint, listDropOffPoint);
    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px', maxHeight: '350px', overflowY: 'auto' }}>
            <Timeline
                style={{ paddingTop: '10px' }}
                mode='left'
                items={listPickUpPoint}
            />
            <Timeline
                style={{ paddingTop: '10px' }}
                mode='left'
                items={listDropOffPoint}
            />
        </div>
    )
}

export default TabJourneysComponent