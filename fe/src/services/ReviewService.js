import { axiosJWT } from "./UserService";
import axios from "axios";

export const createReview = async (access_token, data) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/review/create`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getReviewsByBusOwner = async (access_token, id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/review/get-reviews-by-busowner/${id}`)
    return res.data
}

export const deleteBus = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/bus/delete/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const updateBus = async (id, data, access_token) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/bus/update/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}
