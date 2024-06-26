import axios from "axios"
import { axiosJWT } from "./UserService";


export const createTrip = async (access_token, data) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/trip/create`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const getTripsByBusOwner = async (id, access_token, day) => {
    console.log('get data');
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/trip/get-all-by-bus-owner/${id}?day=${day}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const deleteTrip = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/trip/delete/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const updateTrip = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/trip/update/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const getTripsBySearch = async (data) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/trip/get-trips-by-search`, {
        params: { data }
    },)
    return res.data
}

export const getTripsByFilter = async (data) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/trip/get-trips-by-filter`, {
        params: { data }
    },)
    return res.data
}

export const getTripsByDriver = async (id, access_token, day) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/trip/get-all-by-driver/${id}?day=${day}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const getTripRunningByDriver = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/trip/get-running-by-driver/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const updateFinishTrip = async (id, access_token) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/trip/update-finish-trip/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}