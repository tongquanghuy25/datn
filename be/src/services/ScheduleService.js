const { BusOwner, Schedule, User, Bus, Route, Driver } = require("../models/index");

const createSchedule = (newSchedule) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkBusOwner = await BusOwner.findByPk(newSchedule.busOwnerId);
            if (checkBusOwner === null) {
                resolve({
                    status: 400,
                    message: 'Nhà xe không tồn tại'
                })
                return;
            }

            await Schedule.create(newSchedule)
            resolve({
                status: 200,
                message: 'Thêm lịch trình thành công !',
            })
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const getAllByBusOwner = (busOwnerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const allSchedule = await Schedule.findAll({
                where: { busOwnerId: busOwnerId },
                include: [
                    { model: Route, as: 'route', required: true },
                    { model: Bus, as: 'bus', attributes: ['licensePlate', 'typeBus'], required: true },
                    {
                        model: Driver,
                        as: 'driver',
                        attributes: { exclude: ['busOwnerId', 'tripNumber'] },
                        include: [{ model: User, as: 'user', attributes: ['name'] }]
                    }
                ],
                order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']]
            });

            resolve({
                status: 200,
                message: 'Success',
                data: allSchedule
            })

        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const updateSchedule = (scheduleId, data) => {
    return new Promise(async (resolve, reject) => {
        try {

            const checkSchedule = await Schedule.findByPk(scheduleId);
            if (checkSchedule === null) {
                resolve({
                    status: 404,
                    message: 'Lịch trình không tồn tại!'
                })
                return;
            }
            await Schedule.update({ ...data }, { where: { id: scheduleId } });

            resolve({
                status: 200,
                message: 'Cập nhật lịch trình thành công!',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteSchedule = (scheduleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Schedule.destroy({ where: { id: scheduleId } });
            resolve({
                status: 200,
                message: 'Xóa lịch trình thành công!',
            })
        } catch (e) {
            reject(e)
        }
    })
}


module.exports = {
    createSchedule,
    getAllByBusOwner,
    deleteSchedule,
    updateSchedule,
}