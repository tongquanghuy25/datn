const DriverService = require('../services/DriverService')
const BusService = require('../services/BusService');
const { deleteImgCloud } = require('../utils');
const cloudinary = require('cloudinary').v2;


const createBus = async (req, res) => {
    try {
        // console.log('req', req.body, req.file, req.files);
        let { licensePlate, typeBus, type, numberSeat, color, convinients, busOwnerId } = req.body
        const arrPath = req.files.map((file) => file?.path)
        const avatar = arrPath[0]
        const images = arrPath.slice(1)

        if (!licensePlate || !typeBus || !color || !busOwnerId) {
            if (req.file && req.file?.public_id) await deleteImgCloud({ files: req.files })
            return res.status(200).json({
                status: 'ERR',
                message: 'Thông tin nhập vào chưa đủ !'
            })
        }

        if (typeBus === 'Khác') {
            typeBus = `${type} ${numberSeat}`
            console.log('t', typeBus);
        } else {
            numberSeat = typeBus.split(" ").pop()
        }

        numberSeat = parseInt(numberSeat)

        convinients = convinients?.split(",")


        const response = await BusService.createBus({ licensePlate, typeBus, numberSeat, color, convinients, busOwnerId, images, avatar })
        if (response.status !== 'OK') {
            if (req.files) await deleteImgCloud({ files: req.files })
            return res.status(200).json(response)
        }
        return res.status(200).json(response)



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
            return res.status(200).json({
                status: 'ERR',
                message: 'Id nhà xe không đúng!'
            })
        }
        const response = await BusService.getBussByBusOwner(ownerId)
        return res.status(200).json(response)
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
        console.log('data', data);
        if (!busId) {
            if (req.files) await deleteImgCloud({ files: req?.files })
            return res.status(200).json({
                status: 'ERR',
                message: 'Id xe không được bỏ trống !'
            })
        }
        const response = await BusService.updateBus(busId, data)
        if (req.files?.length > 0 && response.status !== 'OK') deleteImgCloud({ files: req.files })
        return res.status(200).json(response)


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
            return res.status(200).json({
                status: 'ERR',
                message: 'Id xe không được bỏ trống !'
            })
        }
        const response = await BusService.deleteBus(busId)
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




const getAllBusOwnerNotAccept = async (req, res) => {
    try {

        const response = await BusOwnerSevice.getAllBusOwnerNotAccept()
        return res.status(200).json(response)
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
    getAllBusOwner,
    getAllBusOwnerNotAccept,
    editBusOwner,
}
