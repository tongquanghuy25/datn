const BusOwnerSevice = require('../services/BusOwnerService')

const createBusOwner = async (req, res) => {
    try {
        const { userId, busOwnerName, address, citizenId, route } = req.body

        if (!userId || !busOwnerName || !address || !citizenId || !route) {
            return res.status(400).json({
                message: 'Thông tin nhập vào chưa đủ!'
            })
        }
        const response = await BusOwnerSevice.createBusOwner(req.body)

        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllBusOwner = async (req, res) => {
    try {

        const response = await BusOwnerSevice.getAllBusOwner()
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const editBusOwner = async (req, res) => {
    try {
        const busOwnerId = req.params.id
        const data = req.body
        if (!busOwnerId) {
            return res.status(400).json({
                message: 'Id nhà xe không được bỏ trống !'
            })
        }
        const response = await BusOwnerSevice.editBusOwner(busOwnerId, data)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteBusOwner = async (req, res) => {
    try {
        const busOwnerId = req.params.id
        if (!busOwnerId) {
            return res.status(400).json({
                message: 'Id nhà xe không được bỏ trống !'
            })
        }
        const response = await BusOwnerSevice.deleteBusOwner(busOwnerId)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getAllBusOwnerNotAccept = async (req, res) => {
    try {

        const response = await BusOwnerSevice.getAllBusOwnerNotAccept()
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailBusOwnerByUserId = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(400).json({
                message: 'Id người dùng không được bỏ trống!'
            })
        }
        const response = await BusOwnerSevice.getDetailBusOwnerByUserId(userId)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createBusOwner,
    getAllBusOwner,
    getAllBusOwnerNotAccept,
    editBusOwner,
    deleteBusOwner,
    getDetailBusOwnerByUserId
}
