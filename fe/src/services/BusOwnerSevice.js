import { axiosJWT } from "./UserService";

export const busOwnerRegister = async (access_token, data) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/bus-owner/register`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getAllBusOwner = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/bus-owner/get-all`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}


export const editBusOwner = async (id, data, access_token) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/bus-owner/edit/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    console.log('sta', res.data);
    return res.data
}

export const deleteBusOwner = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/bus-owner/delete/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const getAllBusOwnerNotAccept = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/bus-owner/get-all-not-accept`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const getDetailBusOwnerByUserId = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/bus-owner/get-detail-by-userId/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

