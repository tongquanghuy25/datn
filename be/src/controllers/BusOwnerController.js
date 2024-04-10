const BusOwnerSevice = require('../services/BusOwnerService')
const JwtService = require('../services/JwtService')

const createBusOwner = async (req, res) => {
    try {
        const { userId, busOwnerName, address, citizenId, route } = req.body

        if (!userId || !busOwnerName || !address || !citizenId || !route) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await BusOwnerSevice.createBusOwner(req.body)
        console.log('hhuu', response);

        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllBusOwner = async (req, res) => {
    try {

        const response = await BusOwnerSevice.getAllBusOwner()
        return res.status(200).json(response)
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
            return res.status(200).json({
                status: 'ERR',
                message: 'Id nhà xe không được bỏ trống !'
            })
        }
        const response = await BusOwnerSevice.editBusOwner(busOwnerId, data)
        return res.status(200).json(response)
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
            return res.status(200).json({
                status: 'ERR',
                message: 'Id nhà xe không được bỏ trống !'
            })
        }
        const response = await BusOwnerSevice.deleteBusOwner(busOwnerId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getAllBusOwnerNotAccept = async (req, res) => {
    try {

        const response = await BusOwnerSevice.createBusOwner(req.body)
        console.log('hhuu', response);

        return res.status(200).json(response)
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
    deleteBusOwner
}
