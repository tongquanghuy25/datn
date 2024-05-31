import { Modal } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import TabSeatSelection from '../../BusCard/TabContent/TabBookTicket/TabBookTicket';
import { successMes } from '../../Message/Message';




const ModalOrderTicket = (props) => {
    const { isOrdering, setIsOrdering, trip } = props

    const handleOrderSuccess = () => {
        setIsOrdering(false)
        successMes('Đặt vé thành công')
    }


    return (
        <Modal
            title="Chỉnh sửa người dùng"
            open={isOrdering}
            footer={''}
            onCancel={() => {
                setIsOrdering(false)
            }}
            width={'90%'}
            style={{
                top: 10,
            }}
        >
            <TabSeatSelection
                typeBus={trip?.busId.typeBus}
                paymentRequire={trip?.paymentRequire}
                prebooking={trip?.prebooking}
                routeId={trip?.routeId.id}
                ticketPrice={trip?.ticketPrice}
                departureTime={trip?.departureTime}
                tripId={trip?.id}
                departureDate={trip?.departureDate}
                busOwnerName={trip?.busOwnerId.busOwnerName}
                routeName={`${trip?.routeId.placeStart} - ${trip?.routeId.placeEnd}`}
                isAgent={true}
                handleOrderSuccess={handleOrderSuccess}
            />
        </Modal >
    )
}

export default ModalOrderTicket