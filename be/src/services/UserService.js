const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");
const { deleteImgCloud, generateRandomCode } = require("../utils");
const { sendEmailResetPassword } = require("./EmailService");


const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, phone, avatar } = newUser
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser !== null) {
                resolve({
                    status: 400,
                    message: 'Email đã tồn tại!'
                })
                return
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
                    status: 200,
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
                    status: 404,
                    message: 'Email không chính xác!'
                })
                return;
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)

            if (!comparePassword) {
                resolve({
                    status: 400,
                    message: 'Mật khẩu không chính xác!'
                })
                return;
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
                status: 200,
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
                    status: 404,
                    message: 'Người dùng không tồn tại!'
                })
                return;
            }

            const checkEmail = await User.findOne({
                email: data?.email
            })
            if (checkEmail !== null && checkEmail.email !== data?.email) {
                resolve({
                    status: 400,
                    message: 'Email đã tồn tại!'
                })
                return;
            }
            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 200,
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
                    status: 404,
                    message: 'Người dùng không tồn tại!'
                })
                return;
            }

            const checkEmail = await User.findOne({
                email: data?.email
            })
            if (checkEmail !== null && checkEmail.email !== data?.email) {
                resolve({
                    status: 400,
                    message: 'Email đã tồn tại!'
                })
                return;
            }
            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true })

            if (checkUser?.avatar && data.avatar && updatedUser.avatar) {
                deleteImgCloud({ path: checkUser?.avatar })
            }
            console.log('updatedUser', updatedUser);
            resolve({
                status: 200,
                message: 'Cập nhật thông tin người dùng thành công!',
                data: updatedUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const changePassword = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {


            const checkUser = await User.findOne({
                _id: id,
            })

            if (checkUser === null) {
                resolve({
                    status: 404,
                    message: 'Người dùng không tồn tại!'
                })
                return;
            }

            const comparePassword = bcrypt.compareSync(data.password, checkUser.password)

            if (!comparePassword) {
                resolve({
                    status: 400,
                    message: 'Mật khẩu không chính xác!'
                })
                return;
            }

            const hashNew = bcrypt.hashSync(data.newPassword, 10)

            const updatedUser = await User.findByIdAndUpdate(id, { password: hashNew }, { new: true })

            resolve({
                status: 200,
                message: 'Đổi mật khẩu thành công!',
                data: updatedUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const resetPassword = (email, phone) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                email: email,
                phone: phone
            })
            if (checkUser === null) {
                resolve({
                    status: 404,
                    message: 'Thông tin nhập vào không đúng!'
                })
                return;
            }

            const password = generateRandomCode(8)

            await sendEmailResetPassword(password)

            const hash = bcrypt.hashSync(password, 10)

            const updatedUser = await User.findByIdAndUpdate(checkUser._id, { password: hash }, { new: true })

            resolve({
                status: 200,
                message: 'Cập nhật thông tin người dùng thành công!',
                data: updatedUser
            })
        } catch (e) {
            console.log(e);
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
                    status: 400,
                    message: 'Người dùng không tồn tại!'
                })
                return;
            }

            await User.findByIdAndDelete(id)
            resolve({
                status: 200,
                message: 'Xóa người dùng thành công!',
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
                status: 200,
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
                status: 200,
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
                    status: 404,
                    message: 'Người dùng không tồn tại!'
                })
                return;
            }
            resolve({
                status: 200,
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
    changePassword,
    resetPassword,
    editUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser
}