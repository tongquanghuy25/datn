import { axiosJWT } from "./UserService";

export const createDiscount = async (access_token, data) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/discount/create`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getAllDiscountByBusOwner = async (access_token, busOwnerId) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/discount/get-by-bus-owner/${busOwnerId}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteDiscount = async (access_token, id) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/discount/delete/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const checkDiscount = async (data) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/discount/check`, {
        params: {
            code: data.code,
            busOwnerId: data.busOwnerId
        }
    })
    return res.data
}