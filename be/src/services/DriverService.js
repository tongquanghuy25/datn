const Driver = require("../models/DriverModel");
const User = require("../models/UserModel");
const BusOwner = require("../models/BusOwnerModel");


const createDriver = (userId, busOwnerId) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkBusOwner = await BusOwner.findOne({
                userId: busOwnerId
            })
            if (checkBusOwner === null) {

                resolve({
                    status: 'ERR',
                    message: 'Nhà xe không tồn tại'
                })
            }

            const createdDriver = await Driver.create({
                userId,
                busOwnerId: checkBusOwner._id
            })

            if (createdDriver) {
                resolve({
                    status: 'OK',
                    message: 'Đăng ký tài xế thành công !',
                    data: createdDriver
                })
            }
        } catch (e) {

            reject({ e, userId })
        }
    })
}


const getDriversByBusOwner = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const busOwner = await BusOwner.findOne({ userId: id });
            const busOwnerId = busOwner._id;
            const allDriver = await Driver.find({ busOwnerId: busOwnerId }).populate('userId', 'email name phone avatar').sort({ createdAt: -1, updatedAt: -1 })
            resolve({
                status: 'OK',
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
                    status: 'ERR',
                    message: 'Tài xế không tồn tại!'
                })
            }
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'Tài khoản tài xế không tồn tại!'
                })
            }

            await Driver.findOneAndDelete({ userId: id })
            await User.findByIdAndDelete(id)
            resolve({
                status: 'OK',
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
                status: 'OK',
                message: 'Success',
                data: allDriver
            })
        } catch (e) {
            reject(e)
        }
    })
}

const findBusOwnerIdByUserId = async (id) => {
    try {
        const busOwner = await BusOwner.findOne({ userId: id });
        if (busOwner) {
            return busOwner._id;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Lỗi khi tìm BusOwner:', error);
        throw error;
    }
}

const editBusOwner = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkBusOwner = await BusOwner.findOne({
                _id: id
            })
            if (checkBusOwner === null) {
                resolve({
                    status: 'ERR',
                    message: 'NNhà xe không tồn tại !'
                })
            }

            const updatedBusOwner = await BusOwner.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedBusOwner
            })
        } catch (e) {
            reject(e)
        }
    })
}


const getAllBusOwnerNotAccept = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const allBusOwnerNotAccept = await BusOwner.find({ isAccept: false }).populate('userId').sort({ createdAt: -1, updatedAt: -1 })
            resolve({
                status: 'OK',
                message: 'Success',
                data: allBusOwnerNotAccept
            })
        } catch (e) {
            reject(e)
        }
    })
}





module.exports = {
    createDriver,
    getAllBusOwnerNotAccept,
    getAllDriver,
    getDriversByBusOwner,
    editBusOwner,
    deleteDriver

}