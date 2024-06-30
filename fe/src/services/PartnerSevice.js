import axios from "axios";
import { axiosJWT } from "./UserService";

export const busOwnerRegister = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/partner/register-bus-owner`, data)
    return res.data
}

export const getAllBusOwner = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/partner/get-all-bus-owner`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}


export const editBusOwner = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/partner/edit-bus-owner/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const deleteBusOwner = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/partner/delete-bus-owner/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const getAllPartnerNotAccept = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/partner/get-all-partner-not-accept`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const getDetailBusOwnerByUserId = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/partner/get-detail-bus-owner-by-userId/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const getOverviewBusOwner = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/partner/overview-bus-owner/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const getStatisticBusOwner = async (id, access_token, data) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/partner/statistic-bus-owner/${id}`, {
        params: {
            tab: data.tab,
            startDate: data.startDate,
            endDate: data.endDate,
            startOfMonth: data.startOfMonth,
            endOfMonth: data.endOfMonth,
            selectedMonth: data.selectedMonth,
            selectedYear: data.selectedYear
        },
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}


//AGENT

export const agentRegister = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/partner/register-agent`, data)
    return res.data
}

export const getAllAgent = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/partner/get-all-agent`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}


export const editAgent = async (id, access_token, data) => {
    console.log(data);
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/partner/edit-agent/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const deleteAgent = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/partner/delete-agent/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const getAllAgentNotAccept = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/partner/get-all-agent-not-accept`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const getDetailAgentByUserId = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/partner/get-detail-agent-by-userId/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}


