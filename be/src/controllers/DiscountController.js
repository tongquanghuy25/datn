const DiscountService = require('../services/DiscountService');


const createDiscount = async (req, res) => {
    try {
        let { code, discountType, discountValue, startDate, endDate, description, numberUses, busOwnerId } = req.body
        if (!discountType || !discountValue || !startDate || !endDate || !numberUses || !description) {
            return res.status(400).json({
                message: 'Thông tin nhập vào chưa đủ !'
            })
        }

        const response = await DiscountService.createDiscount({ code, discountType, discountValue, startDate, endDate, description, numberUses, busOwnerId })
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e.e
        })
    }
}

const checkDiscount = async (req, res) => {
    try {
        const code = req.query.code
        const busOwnerId = req.query.busOwnerId
        if (!code) {
            return res.status(400).json({
                message: 'Mã giảm giá không được bỏ trống!'
            })
        }

        const response = await DiscountService.checkDiscount(code, busOwnerId)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getByBusOwner = async (req, res) => {
    try {
        const busOwnerId = req.params.id
        const response = await DiscountService.getByBusOwner(busOwnerId)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteDiscount = async (req, res) => {
    try {
        const id = req.params.id
        const response = await DiscountService.deleteDiscount(id)
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
    createDiscount,
    checkDiscount,
    getByBusOwner,
    deleteDiscount
}
