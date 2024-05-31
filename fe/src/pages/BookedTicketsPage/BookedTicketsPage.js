import React from 'react'
import BookedTicketsComponent from '../../components/BookedTicketsComponent/BookedTicketsComponent'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'


const tripData = [
    {
        createdAt: "2024-05-23T14:08:15.056Z",
        dateDropOff: "22/5/2024",
        datePickUp: "22/5/2024",
        departureDate: "22/05/2024",
        dropOff: "Cầu Tu",
        email: "u2@gmail.com",
        extraCosts: 20000,
        isCancel: false,
        isFinish: false,
        isPaid: true,
        name: "1231",
        paidAt: "2024-05-23T14:08:12.000Z",
        payee: "662f726cf4e64a08e996b749",
        paymentMethod: "paypal",
        phone: "01234567894",
        pickUp: "Đại học Bách Khoa",
        seatCount: 2,
        seats: ['A5', 'A6'],
        status: "Chưa lên xe",
        ticketPrice: 100000,
        timeDropOff: "8:35",
        timePickUp: "6:35",
        totalPrice: 220000,
        tripId: "664db77c65a19e0a50b6c845",
        updatedAt: "2024-05-23T14:08:15.056Z",
        userOrder: "662f726cf4e64a08e996b749",
        __v: 0,
        id: "664f4dcf21733b3d12c69001",
        busOwnerName: "Quang Huy",
        routeName: "Hà Nội-Ninh Bình",
    },
    {
        createdAt: "2024-05-23T14:08:15.056Z",
        dateDropOff: "22/5/2024",
        datePickUp: "22/5/2024",
        departureDate: "22/05/2024",
        dropOff: "Cầu Tu",
        email: "u2@gmail.com",
        extraCosts: 20000,
        isCancel: false,
        isFinish: false,
        isPaid: true,
        name: "1231",
        paidAt: "2024-05-23T14:08:12.000Z",
        payee: "662f726cf4e64a08e996b749",
        paymentMethod: "paypal",
        phone: "01234567894",
        pickUp: "Đại học Bách Khoa",
        seatCount: 2,
        seats: ['A5', 'A6'],
        status: "Chưa lên xe",
        ticketPrice: 100000,
        timeDropOff: "8:35",
        timePickUp: "6:35",
        totalPrice: 220000,
        tripId: "664db77c65a19e0a50b6c845",
        updatedAt: "2024-05-23T14:08:15.056Z",
        userOrder: "662f726cf4e64a08e996b749",
        __v: 0,
        id: "664f4dcf21733b3d12c69001",
        busOwnerName: "Quang Huy",
        routeName: "Hà Nội-Ninh Bình",
    }
]

const BookedTicketsPage = () => {

    return (
        <div>
            <HeaderComponent />
            <BookedTicketsComponent />
        </div>
    )
}

export default BookedTicketsPage