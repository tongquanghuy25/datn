const Report = require("../models/ReportModel");
const BusOwner = require("../models/BusOwnerModel");
const OrderTicket = require("../models/OrderTicketModel");
const { deleteImgCloud } = require("../utils");


const createReport = (newReport) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkBusOwner = await BusOwner.findById(newReport.busOwnerId)
            if (checkBusOwner === null) {
                resolve({
                    status: 404,
                    message: 'Nhà xe không tồn tại!'
                })
                return;
            }

            const createdReport = await Report.create(newReport)
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
            const allReport = await Report.find()
                .populate('busOwnerId', 'busOwnerName')
                .sort({ createdAt: -1, updatedAt: -1 })

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

//

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
    createReport,
    getAll,

    updateBus,
    deleteBus

}