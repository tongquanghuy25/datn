const { BusOwner, Report } = require("../models/index");

const createReport = (newReport) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkBusOwner = await BusOwner.findByPk(newReport.busOwnerId);
            if (checkBusOwner === null) {
                resolve({
                    status: 404,
                    message: 'Nhà xe không tồn tại!'
                })
                return;
            }
            const createdReport = await Report.create(newReport);
            if (createdReport) {
                resolve({
                    status: 200,
                    message: 'Gửi báo cáo/ khiếu nại thành công!',
                    data: createdReport
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}


const getAll = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const allReport = await Report.findAll({
                include: [{ model: BusOwner, as: 'busOwner', attributes: ['busOwnerName'] }],
                order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']]
            });

            resolve({
                status: 200,
                message: 'Success',
                data: allReport
            })

        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}



module.exports = {
    createReport,
    getAll,
}