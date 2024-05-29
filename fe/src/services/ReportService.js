import { axiosJWT } from "./UserService";
import axios from "axios";

export const createReport = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/report/create`, data)
    return res.data
}

export const getAllReport = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/report/get-all`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
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
