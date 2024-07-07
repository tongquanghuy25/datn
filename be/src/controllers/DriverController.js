const DriverService = require('../services/DriverService')
const UserService = require('../services/UserService');
const { deleteImgCloud } = require('../utils');


const createDriver = async (req, res) => {
    try {
        const { name, citizenId, address, licenseType, dateOfBirth, gender, email, phone, password, confirmPassword, busOwnerId } = req.body
        const avatar = req.file?.path

        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!email || !phone || !name || !password || !confirmPassword || !busOwnerId || !citizenId || !address || !licenseType || !dateOfBirth || !gender) {
            if (req.file && req.file?.filename) await deleteImgCloud({ file: req.file })
            return res.status(400).json({
                message: 'Thông tin nhập vào chưa đủ !'
            })
        } else if (!isCheckEmail) {
            if (req.file && req.file?.filename) await deleteImgCloud({ file: req.file })
            return res.status(400).json({
                message: 'Email không đúng định dạng !'
            })
        } else if (password !== confirmPassword) {
            if (req.file && req.file?.filename) await deleteImgCloud({ file: req.file })
            return res.status(400).json({
                message: 'Nhập lại mật khẩu không đúng'
            })
        }
        let responseUser = await UserService.createUser({ email, phone, name, dateOfBirth, gender, password, confirmPassword, role: 'DRIVER', avatar })
        if (responseUser.status !== 200) {
            if (req.file && req.file?.filename) await deleteImgCloud({ file: req.file })
            return res.status(responseUser.status).json(responseUser)
        }
        else {
            const response = await DriverService.createDriver({ userId: responseUser.data.id, busOwnerId, citizenId, address, licenseType, })
            if (response.status !== 200) {
                if (req.file && req.file?.filename) await deleteImgCloud({ file: req.file })
                await UserService.deleteUser(responseUser.data.id)
            }
            return res.status(response.status).json(response)
        }
    } catch (e) {
        if (req.file && req.file?.filename) await deleteImgCloud({ file: req.file })
        if (e.userId) await UserService.deleteUser(e.userId)
        return res.status(404).json({
            message: e.e
        })
    }
}

const getDriversByBusOwner = async (req, res) => {
    try {
        const busOwnerId = req.params.id
        if (!busOwnerId) {
            return res.status(400).json({
                message: 'Id nhà xe không được bỏ trống!'
            })
        }
        const response = await DriverService.getDriversByBusOwner(busOwnerId)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDriversByUserId = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(400).json({
                message: 'Id người dùng không được bỏ trống!'
            })
        }
        const response = await DriverService.getDriversByUserId(userId)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateDriver = async (req, res) => {
    try {
        const driverId = req.params.id
        const avatar = req.file
        const data = avatar ? { ...req.body, avatar: avatar.path } : req.body

        if (!driverId) {
            return res.status(400).json({
                message: 'Id tài xế không được bỏ trống!'
            })
        }
        const response = await DriverService.updateDriver(driverId, data)
        if (avatar && response.status !== 200) deleteImgCloud({ publicId: avatar?.filename })
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteDriver = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(400).json({
                message: 'Id tài xế không được bỏ trống !'
            })
        }
        const response = await DriverService.deleteDriver(userId)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getStatisticDriver = async (req, res) => {
    try {
        const userId = req.params.id
        const driverId = req.params.driverId
        const startDate = req.params.startDate
        const endDate = req.params.endDate
        if (!userId) {
            return res.status(400).json({
                message: 'Id người dùng không được bỏ trống!'
            })
        }
        const response = await DriverService.getStatisticDriver(userId, driverId, startDate, endDate)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createDriver,
    getDriversByBusOwner,
    getDriversByUserId,
    updateDriver,
    deleteDriver,
    getStatisticDriver
}
