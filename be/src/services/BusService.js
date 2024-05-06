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
                    status: 404,
                    message: 'Nhà xe không tồn tại'
                })
                return;
            }

            const createdBus = await Bus.create(newBus)

            if (createdBus) {
                resolve({
                    status: 200,
                    message: 'Thêm xe thành công!',
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
                status: 200,
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
                    status: 404,
                    message: 'Xe không tồn tại!'
                })
                return;
            }
            const updatedBus = await Bus.findByIdAndUpdate(busId, { ...data }, { new: true })
            if (updatedBus && data.deleteImages?.length > 0) {
                for (const img of data.deleteImages) {
                    await deleteImgCloud({ path: img })
                }
            }

            console.log('updatedBus', updatedBus);
            resolve({
                status: 200,
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
                    status: 404,
                    message: 'Xe không tồn tại!'
                })
                return;
            }

            await Bus.findByIdAndDelete(busId)
            if (checkBus.avatar) await deleteImgCloud({ path: checkBus.avatar })
            if (checkBus.images?.length > 0)
                for (const img of checkBus.images) {
                    await deleteImgCloud({ path: img })
                }
            resolve({
                status: 200,
                message: 'Xóa xe thành công!',
            })
        } catch (e) {
            reject(e)
        }
    })
}




module.exports = {
    createBus,
    updateBus,
    getBussByBusOwner,
    deleteBus

}