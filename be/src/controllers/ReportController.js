const ReportService = require('../services/ReportService');
const { deleteImgCloud } = require('../utils');


const createReport = async (req, res) => {
    try {
        const { phone, busOwnerId, title, content } = req.body
        if (!phone || !busOwnerId || !title || !content) {
            return res.status(400).json({ message: 'Nhập thiếu thông tin!' })
        }
        const response = await ReportService.createReport({ phone, busOwnerId, title, content })
        return res.status(response.status).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e.e
        })
    }
}

const getAll = async (req, res) => {
    try {

        const response = await ReportService.getAll()
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
    createReport,
    getAll,

    updateBus,
    deleteBus,
}
