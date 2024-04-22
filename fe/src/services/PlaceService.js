import axios from "axios"

export const createPlace = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/place/add`, {}, {
    })
    return res.data
}

export const getAllProvince = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/place/get-all-province`, {}, {
    })
    return res.data
}

export const getDistrictByProvince = async (provinceId) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/place/get-district-by-province/${provinceId}`, {}, {
    })
    return res.data
}