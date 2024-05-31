const { BusOwner, Bus } = require("../models/index");
const { deleteImgCloud } = require("../utils");


const createBus = (newBus) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkBusOwner = await BusOwner.findOne({
                where: { id: newBus.busOwnerId }
            });
            console.log(checkBusOwner);
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
            console.log(e);
            reject(e)
        }
    })
}

const getBussByBusOwner = (busOwnerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const allBus = await Bus.findAll({
                where: { busOwnerId: busOwnerId },
                order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']]
            });
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
    console.log(data);
    return new Promise(async (resolve, reject) => {
        try {
            const checkBus = await Bus.findOne({
                where: { id: busId }
            });
            if (checkBus === null) {
                resolve({
                    status: 404,
                    message: 'Xe không tồn tại!'
                })
                return;
            }
            const [updateddBus] = await Bus.update(data, {
                where: { id: busId }
            });
            if (updateddBus && data.deleteImages?.length > 0) {
                for (const img of data.deleteImages) {
                    await deleteImgCloud({ path: img })
                }
            }

            resolve({
                status: 200,
                message: 'Cập nhật thông tin xe thành công!',
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
                where: { id: busId }
            });
            if (checkBus === null) {
                resolve({
                    status: 404,
                    message: 'Xe không tồn tại!'
                })
                return;
            }

            await Bus.destroy({
                where: { id: busId }
            });

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