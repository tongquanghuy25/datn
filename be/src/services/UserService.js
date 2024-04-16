const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService")

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, phone, avatar } = newUser
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser !== null) {
                resolve({
                    status: 'ERR',
                    message: 'Email đã tồn tại!'
                })
            }
            const hash = bcrypt.hashSync(password, 10)
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone,
                avatar
            })
            if (createdUser) {
                resolve({
                    status: 'OK',
                    message: 'Đăng ký tài khoản thành công!',
                    data: createdUser
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'Email không chính xác!'
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)

            if (!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: 'Mật khẩu không chính xác!'
                })
            }
            const access_token = await genneralAccessToken({
                id: checkUser.id,
                role: checkUser.role
            })

            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                role: checkUser.role
            })

            resolve({
                status: 'OK',
                message: 'Đăng nhập thành công!',
                access_token,
                refresh_token
            })
        } catch (e) {
            reject(e)
        }
    })
}
const editUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'Người dùng không tồn tại!'
                })
            }

            const checkEmail = await User.findOne({
                email: data?.email
            })
            if (checkEmail !== null) {
                resolve({
                    status: 'ERR',
                    message: 'Email đã tồn tại!'
                })
            }

            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'Chỉnh sửa người dùng thành công!',
                data: updatedUser
            })
        } catch (e) {
            reject(e)
        }
    })
}
const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'Người dùng không tồn tại!'
                })
            }

            const checkEmail = await User.findOne({
                email: data?.email
            })
            if (checkEmail !== null) {
                resolve({
                    status: 'ERR',
                    message: 'Email đã tồn tại!'
                })
            }
            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'Cập nhật thông tin người dùng thành công!',
                data: updatedUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }

            await User.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete user success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteManyUser = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {

            await User.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete user success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find().sort({ createdAt: -1, updatedAt: -1 })
            resolve({
                status: 'OK',
                message: 'Success',
                data: allUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: id
            })
            if (user === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCESS',
                data: user
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    editUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser
}