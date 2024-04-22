const Bus = require("../models/BusModel");
const User = require("../models/UserModel");
const BusOwner = require("../models/BusOwnerModel");
const { deleteImgCloud } = require("../utils");


const createBus = (newBus) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkBusOwner = await BusOwner.findOne({
                busOwnerId: newBus.busOwnerId
            })
            if (checkBusOwner === null) {

                resolve({
                    status: 'ERR',
                    message: 'Nhà xe không tồn tại'
                })
            }

            const createdBus = await Bus.create(newBus)

            if (createdBus) {
                resolve({
                    status: 'OK',
                    message: 'Thêm xe thành công !',
                    data: createdBus
                })
            }
        } catch (e) {

            reject(e)
        }
    })
}


const getBussByBusOwner = (busOwnerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const allBus = await Bus.find({ busOwnerId: busOwnerId }).sort({ createdAt: -1, updatedAt: -1 })
            resolve({
                status: 'OK',
                message: 'Success',
                data: allBus
            })

        } catch (e) {
            reject(e)
        }
    })
}

const updateBus = (busId, data) => {
    return new Promise(async (resolve, reject) => {
        try {


            const checkBus = await Bus.findOne({
                _id: busId
            })
            if (checkBus === null) {
                resolve({
                    status: 'ERR',
                    message: 'Xe không tồn tại!'
                })
            }

            const updatedBus = await Bus.findByIdAndUpdate(busId, { ...data }, { new: true })
            if (updatedBus && data.deleteImages?.length > 0) {
                for (const img of data.deleteImages) {
                    await deleteImgCloud({ path: img })
                }
            }
            resolve({
                status: 'OK',
                message: 'Cập nhật thông tin xe thành công!',
                data: updateBus
            })
        } catch (e) {
            reject(e)
        }
    })
}


const deleteBus = (busId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkBus = await Bus.findOne({
                _id: busId
            })
            if (checkBus === null) {
                resolve({
                    status: 'ERR',
                    message: 'Xe không tồn tại!'
                })
            }

            await Bus.findByIdAndDelete(busId)
            if (checkBus.avatar) await deleteImgCloud({ path: checkBus.avatar })
            if (checkBus.images?.length > 0)
                for (const img of checkBus.images) {
                    await deleteImgCloud({ path: img })
                }
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
    createBus,
    getAllBusOwnerNotAccept,
    updateBus,
    getAllDriver,
    getBussByBusOwner,
    editBusOwner,
    deleteBus

}