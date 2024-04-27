const Driver = require("../models/DriverModel");
const User = require("../models/UserModel");
const BusOwner = require("../models/BusOwnerModel");
const { deleteImgCloud } = require("../utils");


const createDriver = (userId, busOwnerId) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkBusOwner = await BusOwner.findOne({
                userId: busOwnerId
            })
            if (checkBusOwner === null) {

                resolve({
                    status: 404,
                    message: 'Nhà xe không tồn tại'
                })
                return;
            }

            const createdDriver = await Driver.create({
                userId,
                busOwnerId: checkBusOwner._id
            })

            if (createdDriver) {
                resolve({
                    status: 200,
                    message: 'Đăng ký tài xế thành công !',
                    data: createdDriver
                })
            }
        } catch (e) {

            reject({ e, userId })
        }
    })
}


const getDriversByBusOwner = (busOwnerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const allDriver = await Driver.find({ busOwnerId: busOwnerId }).populate('userId', 'email name phone avatar').sort({ createdAt: -1, updatedAt: -1 })
            resolve({
                status: 200,
                message: 'Success',
                data: allDriver
            })
        } catch (e) {
            reject(e)
        }
    })
}


const deleteDriver = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkDriver = await Driver.findOne({
                userId: id
            })
            if (checkDriver === null) {
                resolve({
                    status: 404,
                    message: 'Tài xế không tồn tại!'
                })
                return;
            }
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 404,
                    message: 'Tài khoản tài xế không tồn tại!'
                })
                return;
            }
            await Driver.findOneAndDelete({ userId: id })
            if (checkUser?.avatar) deleteImgCloud({ path: checkUser?.avatar })
            await User.findByIdAndDelete(id)
            resolve({
                status: 200,
                message: 'Xóa tài xế thành công!',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllDriver = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const allDriver = await Driver.find({ isAccept: true }).populate('userId', 'email phone').sort({ createdAt: -1, updatedAt: -1 })

            resolve({
                status: 200,
                message: 'Success',
                data: allDriver
            })
        } catch (e) {
            reject(e)
        }
    })
}



module.exports = {
    createDriver,
    getAllDriver,
    getDriversByBusOwner,
    deleteDriver

}