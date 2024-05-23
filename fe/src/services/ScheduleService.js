import axios from "axios"
import { axiosJWT } from "./UserService";


export const createSchedule = async (access_token, data) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/schedule/create`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const getSchedulesByBusOwner = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/schedule/get-all-by-bus-owner/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const updateSchedule = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/schedule/update/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const deleteSchedule = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/schedule/delete/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const getSchedulesBySearch = async (data) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/Schedule/get-Schedules-by-search`, {
        params: { data }
    },)
    return res.data
}

export const getSchedulesByFilter = async (data) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/Schedule/get-Schedules-by-filter`, {
        params: { data }
    },)
    return res.data
}

export const getSchedulesByDriver = async (id, access_token, day) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/Schedule/get-all-by-driver/${id}?day=${day}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const getScheduleRunningByDriver = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/Schedule/get-running-by-driver/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const updateFinishSchedule = async (id, access_token) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/Schedule/update-finish-Schedule/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}