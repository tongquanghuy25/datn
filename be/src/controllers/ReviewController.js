const ReviewService = require('../services/ReviewService');
const { deleteImgCloud } = require('../utils');


const createReview = async (req, res) => {
    try {
        const { userId, busOwnerId, ticketId, stars, content, name } = req.body
        const response = await ReviewService.createReview({ userId, busOwnerId, ticketId, stars, content, name })
        return res.status(response.status).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e.e
        })
    }
}

const getReviewsByBusOwner = async (req, res) => {
    try {
        const busOwnerId = req.params.id
        if (!busOwnerId) {
            return res.status(400).json({
                message: 'Id nhà xe không được bỏ trống!'
            })
        }
        const response = await ReviewService.getReviewsByBusOwner(busOwnerId)
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
    createReview,
    getReviewsByBusOwner,

    updateBus,
    deleteBus,
}
