import axios from "axios";
import { axiosJWT } from "./UserService";


export const createTicketOrder = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/order/create-ticket`, data)
    return res.data
}

export const getSeatsBookedByTrip = async (tripId) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/order/get-seats-booked-by-trip/${tripId}`)
    return res.data
}

export const getTicketOrderByTrip = async (access_token, tripId) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-ticket-order-by-trip/${tripId}`,
        {
            headers: {
                token: `Bearer ${access_token}`,
            }
        }
    )
    return res.data
}

export const updateStatusTicketOrder = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/order/update-status-ticket/${id}`, data,
        {
            headers: {
                token: `Bearer ${access_token}`,
            }
        }
    )
    return res.data
}

//GOODS
export const createGoodsOrder = async (access_token, data) => {
    console.log(access_token, data);
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create-goods`, data,
        {
            headers: {
                token: `Bearer ${access_token}`,
            }
        }
    )
    return res.data

}
export const updateGoodsOrder = async (id, access_token, data) => {
    console.log(access_token, data);
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/order/update-goods/${id}`, data,
        {
            headers: {
                token: `Bearer ${access_token}`,
            }
        }
    )
    return res.data
}

export const deleteGoodsOrder = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/order/delete-goods/${id}`,
        {
            headers: {
                token: `Bearer ${access_token}`,
            }
        }
    )
    return res.data
}

export const getGoodsOrderByTrip = async (access_token, tripId) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-goods-order-by-trip/${tripId}`,
        {
            headers: {
                token: `Bearer ${access_token}`,
            }
        }
    )
    return res.data
}

export const updateStatusGoodsOrder = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/order/update-status-goods/${id}`, data,
        {
            headers: {
                token: `Bearer ${access_token}`,
            }
        }
    )
    return res.data
}
