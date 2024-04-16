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
// export const getAllBusOwner = async (access_token) => {
//     const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/bus-owner/getAllBusOwner`, {
//         headers: {
//             token: `Bearer ${access_token}`,
//         }
//     })
//     return res.data
// }

export const getAllBusOwner = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/bus-owner/get-all`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}


export const editBusOwner = async (id, data, access_token) => {
    console.log('data, data', data);
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/bus-owner/edit/${id}`, data, {
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
