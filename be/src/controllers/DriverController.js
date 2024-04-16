const DriverService = require('../services/DriverService')
const UserService = require('../services/UserService')
const cloudinary = require('cloudinary').v2;


const createDriver = async (req, res) => {
    try {
        const { email, name, password, confirmPassword, busOwnerId } = req.body
        const avatar = req.file?.path

        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!email || !name || !password || !confirmPassword || !busOwnerId) {
            if (req.file && req.file?.public_id) await cloudinary.uploader.destroy(req.file.public_id);
            return res.status(200).json({
                status: 'ERR',
                message: 'Thông tin nhập vào chưa đủ !'
            })
        } else if (!isCheckEmail) {
            if (req.file && req.file?.public_id) await cloudinary.uploader.destroy(req.file.public_id);
            return res.status(200).json({
                status: 'ERR',
                message: 'Email không đúng định dạng !'
            })
        } else if (password !== confirmPassword) {
            if (req.file && req.file?.public_id) await cloudinary.uploader.destroy(req.file.public_id);
            return res.status(200).json({
                status: 'ERR',
                message: 'Nhập lại mật khẩu không đúng'
            })
        }
        let responseUser = await UserService.createUser({ ...req.body, avatar })
        if (responseUser.status !== 'OK') {
            if (req.file && req.file?.public_id) await cloudinary.uploader.destroy(req.file.public_id);
            console.log('a', responseUser.status);
            return res.status(200).json(responseUser)
        }
        else {
            const response = await DriverService.createDriver(responseUser.data._id, busOwnerId)
            if (response.status !== 'OK') {
                console.log('a');
                if (req.file && req.file?.public_id) await cloudinary.uploader.destroy(req.file.public_id);
                await UserService.deleteUser(responseUser.data._id)
            }
            return res.status(200).json(response)
        }
    } catch (e) {
        if (req.file && req.file?.public_id) await cloudinary.uploader.destroy(req.file.public_id)
        if (e.userId) await UserService.deleteUser(e.userId)
        return res.status(404).json({
            message: e.e
        })
    }
}

const getDriversByBusOwner = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Id người dùng của nhà xe không đúng!'
            })
        }
        const response = await DriverService.getDriversByBusOwner(id)
        return res.status(200).json(response)
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
            return res.status(200).json({
                status: 'ERR',
                message: 'Id tài xế không được bỏ trống !'
            })
        }
        const response = await DriverService.deleteDriver(userId)
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
    createDriver,
    getDriversByBusOwner,
    deleteDriver,
    getAllBusOwner,
    getAllBusOwnerNotAccept,
    editBusOwner,
}
