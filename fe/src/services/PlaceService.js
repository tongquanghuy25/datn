import axios from "axios"

export const createPlace = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/place/add`, {}, {
    })
    return res.data
}