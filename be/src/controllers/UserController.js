const UserService = require('../services/UserService')
const JwtService = require('../services/JwtService')
const uploadCloud = require('../middleware/uploader');
const { deleteImgCloud } = require('../utils');




const createUser = async (req, res) => {
    try {
        const { phone, email, password, confirmPassword } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!email || !password || !confirmPassword || !phone) {
            return res.status(400).json({
                message: 'Thông tin nhập vào chưa đủ !'
            })
        } else if (!isCheckEmail) {
            return res.status(400).json({
                message: 'Email không đúng định dạng !'
            })
        } else if (password !== confirmPassword) {
            return res.status(400).json({
                message: 'Nhập lại mật khẩu không đúng'
            })
        }
        const response = await UserService.createUser(req.body)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const loginUser = async (req, res) => {
    try {
        // console.log('body', req);
        // const { email, password } = req.body
        // const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        // const isCheckEmail = reg.test(email)
        // if (!email || !password) {
        //     return res.status(200).json({
        //         status: 'ERR',
        //         message: 'The input is required'
        //     })
        // } else if (!isCheckEmail) {
        //     return res.status(200).json({
        //         status: 'ERR',
        //         message: 'The input is email'
        //     })
        // }
        const response = await UserService.loginUser(req.body)
        const { refresh_token, ...newReponse } = response
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/',
        })
        return res.status(response.status).json({ ...newReponse, refresh_token })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const editUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if (!userId) {
            return res.status(400).json({
                message: 'Id người dùng không được bỏ trống!'
            })
        }
        const response = await UserService.editUser(userId, data)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const avatar = req.file
        const userId = req.params.id
        const data = avatar ? { ...req.body, avatar: avatar.path } : req.body
        if (!userId) {
            deleteImgCloud({ publicId: avatar?.filename })
            return res.status(400).json({
                message: 'Id người dùng không được bỏ trống!'
            })
        }
        const response = await UserService.updateUser(userId, data)
        if (avatar && response.status !== 200) deleteImgCloud({ publicId: avatar?.filename })
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const changePassword = async (req, res) => {
    try {

        const userId = req.params.id
        const { password, newPassword, confirmNewPassword } = req.body
        if (!userId) {
            return res.status(400).json({
                message: 'Id người dùng không được bỏ trống!'
            })
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                message: 'Nhập lại mật khẩu không đúng!'
            })
        }

        const response = await UserService.changePassword(userId, { password, newPassword })
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const resetPassword = async (req, res) => {
    try {

        const { email, phone } = req.body
        if (!email || !phone) {
            return res.status(400).json({
                message: 'Thông tin nhập vào chưa đủ!'
            })
        }
        const response = await UserService.resetPassword(email, phone)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(400).json({
                message: 'Id người dùng không được bỏ trống!'
            })
        }
        const response = await UserService.deleteUser(userId)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser()
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(400).json({
                message: 'Id người dùng không được bỏ trống!'
            })
        }
        const response = await UserService.getDetailsUser(userId)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const refreshToken = async (req, res) => {
    try {
        let token = req.headers.token.split(' ')[1]
        if (!token) {
            return res.status(400).json({
                message: 'The token is required'
            })
        }
        const response = await JwtService.refreshTokenJwtService(token)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const logoutUser = async (req, res) => {
    try {

        // Trip.updateMany({}, { $set: { prebooking: true } }, (err, result) => {
        //     if (err) {
        //         console.error(err);
        //     } else {
        //         console.log(result);
        //     }
        // });

        // await Trip.findByIdAndUpdate("6631f6867b09020fcdd9815d", { status: 'Chưa khởi hành' })
        // await OrderTicket.updateMany({}, { status: 'Chưa lên xe', isPaid: false })
        // await OrderGoods.updateMany({}, { status: 'Chưa nhận hàng', isPaid: false })

        res.clearCookie('refresh_token')
        return res.status(200).json({
            message: 'Logout successfully'
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const sentMailAdmin = async (req, res) => {
    try {

        res.clearCookie('refresh_token')
        return res.status(200).json({
            message: 'Logout successfully'
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    changePassword,
    resetPassword,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken,
    logoutUser,
    editUser,

    sentMailAdmin
}
