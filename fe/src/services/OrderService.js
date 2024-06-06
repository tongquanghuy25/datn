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

export const getTicketsByUser = async (access_token, useId) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-tickets-by-user/${useId}`,
        {
            headers: {
                token: `Bearer ${access_token}`,
            }
        }
    )
    return res.data
}

export const getTicketById = async (data) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/order/get-tickets-by-id?ticketId=${data?.ticketId}&phone=${data?.phone}`)
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

export const deleteTicketOrder = async (id, access_token, data) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/order/delete-ticket/${id}`,
        {
            params: { data },
            headers: {
                token: `Bearer ${access_token}`,
            }
        }
    )
    return res.data
}

export const changeSeat = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/order/change-seat/${id}`, data,
        {
            headers: {
                token: `Bearer ${access_token}`,
            }
        }
    )
    return res.data
}

export const deleteSeat = async (access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/order/delete-seat`, data,
        {
            headers: {
                token: `Bearer ${access_token}`,
            }
        }
    )
    return res.data
}

export const updateTicketOrder = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/order/update-ticket/${id}`, data,
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

export const deleteGoodsOrder = async (id, access_token, data) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/order/delete-goods/${id}`, data,
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
