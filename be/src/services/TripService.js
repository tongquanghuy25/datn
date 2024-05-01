const Route = require("../models/RouteModel");
const BusOwner = require("../models/BusOwnerModel");
const Trip = require("../models/TripModel");
const StopPoint = require("../models/StopPointModel");
const Bus = require("../models/BusModel");


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

                .populate('busOwnerId', 'busOwnerName')
                .populate({
                    path: 'routeId',
                    select: 'provinceStart districtStart provinceEnd districtEnd',
                })
                .populate('busId', 'avatar typeBus averageRating')
                .limit(2)

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

            let routeIdFinal
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

                if (placesStart?.length > 0) {
                    let routes = await StopPoint.
                        find({
                            routeId: { $in: routeIds },
                            locationId: { $in: placesEnd },
                            isPickUp: false
                        })
                        .distinct('routeId')

                    routeIdFinal.push(...routes)
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
                .populate('busId', 'avatar typeBus averageRating isRecliningSeat')
                .populate('busOwnerId', 'busOwnerName')
                .populate({
                    path: 'routeId',
                    select: 'provinceStart districtStart provinceEnd districtEnd',
                })
                .sort(orderTrip)

            console.log('filterTrip', filterTrip);

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
    updateTrip,
    getTripsBySearch,
    getTripsByFilter
}