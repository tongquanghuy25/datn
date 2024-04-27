const Bus = require("../models/BusModel");
const BusOwner = require("../models/BusOwnerModel");
const Trip = require("../models/TripModel");


const createTrip = (dates, newTrip) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkBusOwner = await BusOwner.findById(newTrip.busOwnerId)
            if (checkBusOwner === null) {
                resolve({
                    status: 400,
                    message: 'Nhà xe không tồn tại'
                })
                return;
            }

            for (const date of dates) {
                await Trip.create({ ...newTrip, departureDate: date })

            }
            resolve({
                status: 200,
                message: 'Thêm chuyến thành công !',
            })
        } catch (e) {
            reject(e)
        }
    })
}


const getAllByBusOwner = (busOwnerId, day) => {
    return new Promise(async (resolve, reject) => {
        try {
            const allTrip = await Trip.
                find({ busOwnerId: busOwnerId, departureDate: day })
                .populate('routeId')
                .populate('busId', 'licensePlate')
                .populate({
                    path: 'driverId',
                    populate: {
                        path: 'userId',
                        select: 'name'
                    },
                    select: '-busOwnerId -tripNumber'
                })
                .sort({ createdAt: -1, updatedAt: -1 })

            resolve({
                status: 200,
                message: 'Success',
                data: allTrip
            })

        } catch (e) {
            reject(e)
        }
    })
}

const updateTrip = (tripId, data) => {
    return new Promise(async (resolve, reject) => {
        try {


            const checkTrip = await Trip.findOne({
                _id: tripId
            })
            if (checkTrip === null) {
                resolve({
                    status: 404,
                    message: 'Chuyến xe không tồn tại!'
                })
                return;
            }

            const updatedTrip = await Trip.findByIdAndUpdate(tripId, { ...data }, { new: true })

            resolve({
                status: 200,
                message: 'Cập nhật thông tin chuyến thành công!',
            })
        } catch (e) {
            reject(e)
        }
    })
}


const deleteTrip = (tripId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Trip.findByIdAndDelete(tripId)
            resolve({
                status: 200,
                message: 'Xóa chuyến thành công!',
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createTrip,
    getAllByBusOwner,
    deleteTrip,
    updateTrip
}