const DriverService = require('../services/DriverService')
const UserService = require('../services/UserService');
const { deleteImgCloud } = require('../utils');


const createDriver = async (req, res) => {
    try {
        const { email, name, password, confirmPassword, busOwnerId } = req.body
        const avatar = req.file?.path

        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!email || !name || !password || !confirmPassword || !busOwnerId) {
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
        let responseUser = await UserService.createUser({ email, name, password, confirmPassword, role: 'driver', avatar })
        if (responseUser.status !== 200) {
            if (req.file && req.file?.filename) await deleteImgCloud({ file: req.file })
            return res.status(responseUser.status).json(responseUser)
        }
        else {
            const response = await DriverService.createDriver(responseUser.data._id, busOwnerId)
            if (response.status !== 200) {
                if (req.file && req.file?.filename) await deleteImgCloud({ file: req.file })
                await UserService.deleteUser(responseUser.data._id)
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


module.exports = {
    createDriver,
    getDriversByBusOwner,
    getDriversByUserId,
    deleteDriver
}
