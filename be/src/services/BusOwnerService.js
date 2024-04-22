const BusOwner = require("../models/BusOwnerModel");
const User = require("../models/UserModel");

const createBusOwner = (newBusOwner) => {
    return new Promise(async (resolve, reject) => {

        const { userId, busOwnerName, address, citizenId, route } = newBusOwner

        try {
            const checkUser = await User.findOne({
                _id: userId
            })
            if (checkUser === null) {

                resolve({
                    status: 'ERR',
                    message: 'Người dùng không tồn tại'
                })
            }

            const createdBusOwner = await BusOwner.create({
                userId,
                busOwnerName,
                address,
                citizenId,
                route
            })

            if (createdBusOwner) {
                resolve({
                    status: 'OK',
                    message: 'Đăng ký nhà xe thành công !',
                    data: createdBusOwner
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const getAllBusOwner = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const allBusOwner = await BusOwner.find({ isAccept: true }).populate('userId', 'email phone').sort({ createdAt: -1, updatedAt: -1 })

            resolve({
                status: 'OK',
                message: 'Success',
                data: allBusOwner
            })
        } catch (e) {
            reject(e)
        }
    })
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

const deleteBusOwner = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkBusOwner = await BusOwner.findOne({
                _id: id
            })
            if (checkBusOwner === null) {
                resolve({
                    status: 'ERR',
                    message: 'The bus owner is not defined'
                })
            }

            await BusOwner.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete bus owner success',
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

const getDetailBusOwnerByUserId = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const busOwner = await BusOwner.findOne({
                userId: id
            })
            if (busOwner === null) {
                resolve({
                    status: 'ERR',
                    message: 'Nhà xe không tồn tại!'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCESS',
                data: busOwner
            })
        } catch (e) {
            reject(e)
        }
    })
}



module.exports = {
    createBusOwner,
    getAllBusOwnerNotAccept,
    getAllBusOwner,
    editBusOwner,
    deleteBusOwner,
    getDetailBusOwnerByUserId

}