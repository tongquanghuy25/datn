const { User, BusOwner, Agent } = require("../models/index");
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
                userId: res?.data.id,
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
                await UserService.deleteUser(res?.data.id)
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

            const allBusOwner = await BusOwner.findAll({
                where: { isAccept: true },
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['email', 'phone']
                }],
                order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']]
            });

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
                where: { id: id }
            });
            if (checkBusOwner === null) {
                resolve({
                    status: 404,
                    message: 'Nhà xe không tồn tại!'
                })
                return;
            }

            await BusOwner.update(data, {
                where: { id: id }
            });

            resolve({
                status: 200,
                message: 'Sửa nhà xe thành công!',
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
                where: { id: id }
            });
            if (checkBusOwner === null) {
                resolve({
                    status: 404,
                    message: 'Nhà xe không tồn tại!'
                })
                return;
            }

            await BusOwner.destroy({
                where: { id: id }
            });

            await User.destroy({
                where: { id: checkBusOwner.userId }
            });
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
            const allBusOwnerNotAccept = await BusOwner.findAll({
                where: { isAccept: false },
                include: [{ model: User, as: 'user' }], // Sử dụng 'user' thay vì 'userId'
                order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']]
            });

            const allAgentNotAccept = await Agent.findAll({
                where: { isAccept: false },
                include: [{ model: User, as: 'user' }],
                order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']]
            });

            const list = [...allBusOwnerNotAccept, ...allAgentNotAccept]
            list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

            resolve({
                status: 200,
                message: 'Success',
                data: list
            })
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const getDetailBusOwnerByUserId = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const busOwner = await BusOwner.findOne({
                where: { userId: id }
            });
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
                userId: res?.data.id,
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
            } else {
                await UserService.deleteUser(res?.data.id)
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

            const allAgent = await Agent.findAll({
                where: { isAccept: true },
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['email', 'phone']
                }],
                order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']],
            });

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
                where: { id: id }
            });
            if (checkAgent === null) {
                resolve({
                    status: 404,
                    message: 'Đại lý không tồn tại!'
                })
                return;
            }

            await Agent.update(data, {
                where: { id: id }
            });

            resolve({
                status: 200,
                message: 'Sửa đại lý thành công!',
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
                where: { id: id }
            });
            if (checkAgent === null) {
                resolve({
                    status: 404,
                    message: 'Đại lý không tồn tại!'
                })
                return;
            }

            await Agent.destroy({
                where: { id: id }
            });

            await User.destroy({
                where: { id: checkAgent.userId }
            });

            resolve({
                status: 200,
                message: 'Xóa đại lý thành công!',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailAgentByUserId = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const agent = await Agent.findOne({
                where: { userId: id }
            });
            if (agent === null) {
                resolve({
                    status: 404,
                    message: 'Đại lý không tồn tại!'
                })
                return;
            }
            resolve({
                status: 200,
                message: 'SUCESS',
                data: agent
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
    getAllAgent,
    editAgent,
    deleteAgent,
    getDetailAgentByUserId

}