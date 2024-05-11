import { axiosJWT } from "./UserService";

export const driverRegister = async (access_token, data) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/driver/register`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getDetailDriverByUserId = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/driver/get-detail-by-user-id/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getDriversByBusOwner = async (access_token, id) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/driver/get-driver-by-busowner/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteDriver = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/driver/delete/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}