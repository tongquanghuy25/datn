import { axiosJWT } from "./UserService";





export const addLocation = async (data, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/route/add-location`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const addStopPoint = async (data, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/route/add-stop-point`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const deleteStopPoint = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/route/delete-stop-point/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const deleteRoute = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/route/delete-route/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const updateRoute = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/route/update-route/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const getAllPlace = async (access_token, province, district) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/route/get-all-place/${province}/${district}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const createRoute = async (data, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/route/create-route`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}
export const getRouteByBusOwner = async (id, access_token) => {
    console.log('id, access_token', id, access_token);
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/route/get-route-by-busowner/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getStopPointsByBusRoute = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/route/get-stop-point-by-route/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

