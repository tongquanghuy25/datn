const Route = require("../models/RouteModel");
const BusOwner = require("../models/BusOwnerModel");
const Schedule = require("../models/ScheduleModel");
const StopPoint = require("../models/StopPointModel");
const Bus = require("../models/BusModel");
const OrderTicket = require("../models/OrderTicketModel");
const OrderGoods = require("../models/OrderGoodsMode;");


const createSchedule = (newSchedule) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkBusOwner = await BusOwner.findById(newSchedule.busOwnerId)
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
            const allSchedule = await Schedule.
                find({ busOwnerId: busOwnerId })
                .populate('routeId')
                .populate('busId', 'licensePlate typeBus')
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
                data: allSchedule
            })

        } catch (e) {
            reject(e)
        }
    })
}

const updateSchedule = (scheduleId, data) => {
    return new Promise(async (resolve, reject) => {
        try {


            const checkSchedule = await Schedule.findOne({
                _id: scheduleId
            })
            if (checkSchedule === null) {
                resolve({
                    status: 404,
                    message: 'Lịch trình không tồn tại!'
                })
                return;
            }

            const updatedSchedule = await Schedule.findByIdAndUpdate(scheduleId, { ...data }, { new: true })

            resolve({
                status: 200,
                message: 'Cập nhật lịch trình thành công!',
                data: updatedSchedule
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteSchedule = (scheduleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Schedule.findByIdAndDelete(scheduleId)
            resolve({
                status: 200,
                message: 'Xóa lịch trình thành công!',
            })
        } catch (e) {
            reject(e)
        }
    })
}


const getAllByDriver = (driverId, day) => {
    return new Promise(async (resolve, reject) => {
        try {
            const allTrip = await Trip.
                find({ driverId: driverId, departureDate: day })
                .populate('routeId')
                .populate('busId')
                .sort({ departureTime: -1 })

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

const getRunningByDriver = (driverId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const trip = await Trip.
                findOne({ driverId: driverId, status: 'Đã khởi hành' })
                .populate('routeId')
                .populate('busId')

            const listTicketOrder = await OrderTicket.find({ tripId: trip._id })
            const listGoodsOrder = await OrderGoods.find({ tripId: trip._id })
            resolve({
                status: 200,
                message: 'Success',
                data: { trip, listTicketOrder, listGoodsOrder }
            })

        } catch (e) {
            reject(e)
        }
    })
}

const getTripsBySearch = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { provinceStart, districtStart, provinceEnd, districtEnd, date } = data

            const routeIds = await Route.find(data).select('_id')


            const allTrip = await Trip.
                find({
                    departureDate: date,
                    routeId: { $in: routeIds },
                    // status: 'Chưa khởi hành'
                })
                .populate({
                    path: 'busOwnerId',
                    populate: {
                        path: 'userId',
                    }
                })
                .populate('routeId')
                .populate('busId')


            // .populate('busOwnerId', 'busOwnerName')
            // .populate({
            //     path: 'routeId',
            //     select: 'provinceStart districtStart provinceEnd districtEnd journeyTime',
            // })
            // .populate('busId', 'avatar typeBus averageRating reviewCount')
            // .limit(2)

            // .where({
            //     'routeId.provinceStart': 'Bắc Kạn',
            //     'routeId.provinceEnd': 'Bà Rịa - Vũng Tàu'
            // })
            // .sort({ createdAt: -1, updatedAt: -1 })

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

const getTripsByFilter = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { provinceStart, districtStart, provinceEnd, districtEnd, date, order, placesEnd, placesStart, priceRange, isRecliningSeat, minRating } = data

            const routeIds = await Route.find(data).select('_id')

            let routeIdFinal = []

            if (placesEnd?.length > 0 || placesStart?.length > 0) {
                if (placesStart?.length > 0) {
                    routeIdFinal = await StopPoint.
                        find({
                            routeId: { $in: routeIds },
                            locationId: { $in: placesStart },
                            isPickUp: true
                        })
                        .distinct('routeId')
                }

                if (placesEnd?.length > 0) {


                    let routes = await StopPoint.
                        find({
                            routeId: { $in: routeIds },
                            locationId: { $in: placesEnd },
                            isPickUp: false
                        })
                        .distinct('routeId')

                    const routesString = routes.map(route => route.toString());
                    routeIdFinal = routeIdFinal.filter(item => routesString.includes(item.toString()))

                }
            } else routeIdFinal = routeIds


            let filterBus = {}
            if (isRecliningSeat === 'true' || isRecliningSeat === 'false') {
                filterBus = { isRecliningSeat: JSON.parse(isRecliningSeat) }
            }

            if (minRating) {
                filterBus = { ...filterBus, averageRating: { $gt: parseInt(minRating) } }
            }

            let busIds = []
            if (JSON.stringify(filterBus) !== '{}') {
                busIds = await Bus.find(filterBus).select('_id')

            }


            let filterTrip = {
                departureDate: date,
                routeId: { $in: routeIdFinal },
                ticketPrice: { $gt: priceRange[0], $lt: priceRange[1] }
                // status: 'Chưa khởi hành'

            }
            if (JSON.stringify(filterBus) !== '{}') filterTrip = { ...filterTrip, busId: { $in: busIds } }



            let orderTrip = {}
            if (order === 'price_asc') {
                orderTrip = { ticketPrice: 1 }
            } else if (order === 'price_desc') {
                orderTrip = { ticketPrice: -1 }

            } else if (order === 'time_asc') {
                orderTrip = { departureTime: 1 }

            } else if (order === 'time_desc') {
                orderTrip = { departureTime: -1 }

            }


            const allTrip = await Trip.
                find(filterTrip)
                .populate('busId')
                .populate('busOwnerId')
                .populate({
                    path: 'routeId'
                })
                .sort(orderTrip)

            // console.log('filterTrip', filterTrip);

            // const allTrip = await Trip.
            //     find({
            //         departureDate: date,
            //         routeId: { $in: routeIds },
            //         // status: 'Chưa khởi hành'
            //     })
            //     .populate('busOwnerId', 'busOwnerName')
            //     .populate({
            //         path: 'routeId',
            //         select: 'provinceStart districtStart provinceEnd districtEnd',
            //     })
            //     .populate('busId', 'avatar typeBus averageRating')
            //     .limit(2)

            resolve({
                status: 200,
                message: 'Success',
                data: allTrip
            })

        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const updateFinishTrip = (tripId) => {
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
            //6631f6867b09020fcdd9815d
            const updatedTrip = await Trip.findByIdAndUpdate(tripId, { status: 'Đã kết thúc' }, { new: true })

            resolve({
                status: 200,
                message: 'Kết thúc chuyến xe thành công!',
                data: updatedTrip
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
    getTripsBySearch,
    getTripsByFilter,
    getAllByDriver,
    getRunningByDriver,
    updateFinishTrip
}