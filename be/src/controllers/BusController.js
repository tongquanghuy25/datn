const BusService = require('../services/BusService');
const { deleteImgCloud } = require('../utils');


const createBus = async (req, res) => {
    try {
        let { licensePlate, typeBus, type, numberSeat, color, convinients, busOwnerId, floorNumber } = req.body
        const arrPath = req.files.map((file) => file?.path)
        let avatar
        let images = []
        if (req.files && req.files[0]?.fieldname === 'avatar') {
            avatar = arrPath[0]
            images = arrPath.slice(1)
        } else {
            images = arrPath
        }
        if (!licensePlate || !typeBus || !color || !busOwnerId || !floorNumber) {
            if (req.file && req.file?.public_id) await deleteImgCloud({ files: req.files })
            return res.status(400).json({
                message: 'Thông tin nhập vào chưa đủ !'
            })
        }

        if (typeBus === 'Khác') {
            typeBus = `${type} ${numberSeat}`
        } else {
            numberSeat = typeBus.split(" ").pop()
        }

        numberSeat = parseInt(numberSeat)

        convinients = convinients?.split(",")


        const response = await BusService.createBus({ licensePlate, typeBus, numberSeat, color, convinients, busOwnerId, images, avatar, floorNumber })
        if (response.status !== 200) {
            if (req.files) await deleteImgCloud({ files: req.files })
            return res.status(response.status).json(response)
        }
        return res.status(response.status).json(response)



    } catch (e) {
        if (req.files) await deleteImgCloud({ files: req?.files })
        return res.status(404).json({
            message: e.e
        })
    }
}

const getBussByBusOwner = async (req, res) => {
    try {
        const ownerId = req.params.id
        if (!ownerId) {
            return res.status(400).json({
                message: 'Id nhà xe không được bỏ trống!'
            })
        }
        const response = await BusService.getBussByBusOwner(ownerId)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateBus = async (req, res) => {
    try {
        const busId = req.params.id
        let data = req.body
        delete data.avatar
        delete data.newImages
        if (data.images === 'null') data.images = []
        if (data.convinients === 'null') data.convinients = []

        req.files?.forEach(file => {
            if (file.fieldname && file.fieldname === 'avatar') data = { ...data, avatar: file.path }
            else if (file.fieldname) {
                if (!(data.images?.length > 0)) data.images = []
                data.images.push(file.path)
            }
        })
        if (!busId) {
            if (req.files) await deleteImgCloud({ files: req?.files })
            return res.status(400).json({
                message: 'Id xe không được bỏ trống !'
            })
        }
        const response = await BusService.updateBus(busId, data)
        if (req.files?.length > 0 && response.status !== 200) deleteImgCloud({ files: req.files })
        return res.status(response.status).json(response)


    } catch (e) {
        if (req.files.length > 0) await deleteImgCloud({ files: req?.files })
        return res.status(404).json({
            message: e
        })
    }
}

const deleteBus = async (req, res) => {
    try {
        const busId = req.params.id
        if (!busId) {
            return res.status(400).json({
                message: 'Id xe không được bỏ trống !'
            })
        }
        const response = await BusService.deleteBus(busId)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}



module.exports = {
    createBus,
    getBussByBusOwner,
    updateBus,
    deleteBus,
}
