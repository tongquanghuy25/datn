import axios from "axios";
import { axiosJWT } from "./UserService";


export const createOrder = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/ticket-order/create`, data)
    return res.data
}

export const getSeatsBookedByTrip = async (tripId) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/ticket-order/get-seats-booked-by-trip/${tripId}`)
    return res.data
}

export const updateStatusTicketOrder = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/ticket-order/update-status/${id}`, data,
        {
            headers: {
                token: `Bearer ${access_token}`,
            }
        }
    )
    return res.data
}
// export const createOrderWithUser = async (access_token, data) => {
//     const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create`, data, {
//         headers: {
//             'Content-Type': 'multipart/form-data',
//             token: `Bearer ${access_token}`,
//         }
//     })
//     return res.data
// }