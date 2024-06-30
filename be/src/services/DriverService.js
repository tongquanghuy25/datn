const { User, BusOwner, Driver } = require("../models/index");
const { deleteImgCloud } = require("../utils");


const createDriver = (newDriver) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkBusOwner = await BusOwner.findOne({
                where: { id: newDriver.busOwnerId }
            });
            if (checkBusOwner === null) {
                resolve({
                    status: 404,
                    message: 'Nhà xe không tồn tại'
                })
                return;
            }

            const createdDriver = await Driver.create(newDriver);
            if (createdDriver) {
                resolve({
                    status: 200,
                    message: 'Đăng ký tài xế thành công !',
                })
            }
        } catch (e) {
            console.log(e);
            reject({ e, userId: newDriver.userId })
        }
    })
}

const getDriversByBusOwner = (busOwnerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const allDriver = await Driver.findAll({
                where: { busOwnerId: busOwnerId },
                include: [{
                    model: User,
                    as: 'user',
                    // attributes: ['email', 'name', 'phone', 'avatar']
                }],
                order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']]
            });
            resolve({
                status: 200,
                message: 'Success',
                data: allDriver
            })
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const getDriversByUserId = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(userId);
            const driver = await Driver.findOne({ where: { userId: userId } })
            resolve({
                status: 200,
                message: 'Success',
                data: driver
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updateDriver = (driverId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findByPk(data.userId, { raw: true });
            if (checkUser === null) {
                resolve({
                    status: 404,
                    message: 'Người dùng không tồn tại!'
                })
                return;
            }
            if (data.email) {
                const checkEmail = await User.findOne({
                    where: { email: data?.email },
                    raw: true
                });
                if (checkEmail !== null && checkEmail.email !== data?.email) {
                    resolve({
                        status: 400,
                        message: 'Email đã tồn tại!'
                    })
                    return;
                }
            }
            await User.update(data, {
                where: { id: data.userId }
            });

            if (checkUser?.avatar && data.avatar) {
                deleteImgCloud({ path: checkUser?.avatar })
            }
            await Driver.update(data, {
                where: { id: driverId }
            });
            resolve({
                status: 200,
                message: 'Chỉnh sửa tài xế thành công!',
            })
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const deleteDriver = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkDriver = await Driver.findOne({ where: { userId: id } });
            if (checkDriver === null) {
                resolve({
                    status: 404,
                    message: 'Tài xế không tồn tại!'
                })
                return;
            }
            const checkUser = await User.findOne({ where: { id: id }, raw: true });
            if (checkUser === null) {
                resolve({
                    status: 404,
                    message: 'Tài khoản tài xế không tồn tại!'
                })
                return;
            }

            await Driver.destroy({ where: { userId: id } });
            if (checkUser?.avatar) deleteImgCloud({ path: checkUser?.avatar })
            await User.destroy({ where: { id: id } });
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
            const allDriver = await Driver.findAll({
                include: [{
                    model: User,
                }],
                order: [
                    ['createdAt', 'DESC'],
                    ['updatedAt', 'DESC']
                ]
            });
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
    deleteDriver,
    updateDriver,
    getDriversByUserId

}