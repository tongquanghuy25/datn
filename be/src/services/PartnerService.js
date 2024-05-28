const BusOwner = require("../models/BusOwnerModel");
const Agent = require("../models/AgentModel");
const User = require("../models/UserModel");
const UserService = require('./UserService')

const createBusOwner = (newBusOwner) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { email, phone, password, confirmPassword, busOwnerName, address, companyType, companyDescription, managerName, citizenId, managerPhone, managerEmail } = newBusOwner
            const res = await UserService.createUser({ email, phone, password, confirmPassword })
            if (res.status !== 200) {
                resolve({
                    status: 404,
                    message: res.message
                })
                return;
            }
            const createdBusOwner = await BusOwner.create({
                userId: res?.data._id,
                busOwnerName,
                address,
                companyType,
                companyDescription,
                managerName,
                citizenId,
                managerPhone,
                managerEmail
            })

            if (createdBusOwner) {
                resolve({
                    status: 200,
                    message: 'Đăng ký nhà xe thành công!',
                    data: createdBusOwner
                })
            } else {
                await UserService.deleteUser(res?.data._id)
            }
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const getAllBusOwner = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const allBusOwner = await BusOwner.find({ isAccept: true }).populate('userId', 'email phone').sort({ createdAt: -1, updatedAt: -1 })

            resolve({
                status: 200,
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
                    status: 404,
                    message: 'Nhà xe không tồn tại!'
                })
                return;
            }

            const updatedBusOwner = await BusOwner.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 200,
                message: 'Sửa nhà xe thành công!',
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
                    status: 404,
                    message: 'Nhà xe không tồn tại!'
                })
                return;
            }

            const busOwnerDeleted = await BusOwner.findByIdAndDelete(id)
            await User.findByIdAndDelete(busOwnerDeleted.userId._id)
            resolve({
                status: 200,
                message: 'Xóa nhà xe thành công!',
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
            const allAgentNotAccept = await Agent.find({ isAccept: false }).populate('userId').sort({ createdAt: -1, updatedAt: -1 })

            const list = [...allBusOwnerNotAccept, ...allAgentNotAccept]
            list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

            resolve({
                status: 200,
                message: 'Success',
                data: list
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
                    status: 404,
                    message: 'Nhà xe không tồn tại!'
                })
                return;
            }
            resolve({
                status: 200,
                message: 'SUCESS',
                data: busOwner
            })
        } catch (e) {
            reject(e)
        }
    })
}

//AGENT

const createAgent = (newAgent) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { email, phone, password, confirmPassword, agentName, address, companyType, companyDescription, managerName, citizenId, managerPhone, managerEmail } = newAgent
            const res = await UserService.createUser({ email, phone, password, confirmPassword })
            if (res.status !== 200) {
                resolve({
                    status: 404,
                    message: res.message
                })
                return;
            }
            const createdAgent = await Agent.create({
                userId: res?.data._id,
                agentName,
                address,
                companyType,
                companyDescription,
                managerName,
                citizenId,
                managerPhone,
                managerEmail
            })

            if (createdAgent) {
                resolve({
                    status: 200,
                    message: 'Đăng ký đại lý thành công! Vui vòng chờ admin xác nhận!',
                    data: createdAgent
                })
            }
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const getAllAgent = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const allAgent = await Agent.find({ isAccept: true }).populate('userId', 'email phone').sort({ createdAt: -1, updatedAt: -1 })

            resolve({
                status: 200,
                message: 'Success',
                data: allAgent
            })
        } catch (e) {
            reject(e)
        }
    })
}

const editAgent = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkAgent = await Agent.findOne({
                _id: id
            })
            if (checkAgent === null) {
                resolve({
                    status: 404,
                    message: 'Đại lý không tồn tại!'
                })
                return;
            }

            const updatedAgent = await Agent.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 200,
                message: 'Sửa đại lý thành công!',
                data: updatedAgent
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteAgent = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkAgent = await Agent.findOne({
                _id: id
            })
            if (checkAgent === null) {
                resolve({
                    status: 404,
                    message: 'Đại lý không tồn tại!'
                })
                return;
            }

            const agentDeleted = await Agent.findByIdAndDelete(id)
            await User.findByIdAndDelete(agentDeleted.userId._id)

            resolve({
                status: 200,
                message: 'Xóa đại lý thành công!',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllAgentNotAccept = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const allAgentNotAccept = await Agent.find({ isAccept: false }).populate('userId').sort({ createdAt: -1, updatedAt: -1 })
            resolve({
                status: 200,
                message: 'Success',
                data: allAgentNotAccept
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailAgentByUserId = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const busOwner = await Agent.findOne({
                userId: id
            })
            if (busOwner === null) {
                resolve({
                    status: 404,
                    message: 'Nhà xe không tồn tại!'
                })
                return;
            }
            resolve({
                status: 200,
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
    getDetailBusOwnerByUserId,

    createAgent,
    getAllAgentNotAccept,
    getAllAgent,
    editAgent,
    deleteAgent,
    getDetailAgentByUserId

}