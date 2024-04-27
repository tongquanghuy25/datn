const Route = require("../models/RouteModel");
const StopPoint = require("../models/StopPointModel");
const Location = require("../models/LocationModel");
const BusOwner = require("../models/BusOwnerModel");
const Trip = require("../models/TripModel");


const addLocation = (newLocation) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkLocation = await Location.findOne({
                province: newLocation.province,
                district: newLocation.district,
                place: newLocation.place
            })
            if (checkLocation === null) {
                const createdLocation = await Location.create(newLocation)
                if (createdLocation) {
                    resolve({
                        status: 200,
                        message: 'Thêm địa điểm thành công!',
                        data: createdLocation
                    })
                }
            } else {
                resolve({
                    status: 200,
                    message: 'Thêm địa điểm thành công!',
                    data: checkLocation
                })
            }



        } catch (e) {
            reject(e)
        }
    })
}

const addStopPoint = (newStopPoint) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkLocation = await Location.findOne({
                province: newStopPoint.province,
                district: newStopPoint.district,
                place: newStopPoint.place
            })
            if (checkLocation === null) {
                const createdLocation = await Location.create({
                    province: newStopPoint.province,
                    district: newStopPoint.district,
                    place: newStopPoint.place
                })
                const createdStopPoint = await StopPoint.create({
                    routeId: newStopPoint.routeId,
                    locationId: createdLocation._id,
                    timeFromStart: newStopPoint.timeFromStart,
                    extracost: newStopPoint.extracost,
                    isPickUp: newStopPoint.isPickUp
                })
                if (createdStopPoint) {
                    resolve({
                        status: 200,
                        message: 'Thêm điểm dừng thành công!',
                        data: createdStopPoint
                    })
                }
            } else {
                const createdStopPoint = await StopPoint.create({
                    routeId: newStopPoint.routeId,
                    locationId: checkLocation._id,
                    timeFromStart: newStopPoint.timeFromStart,
                    extracost: newStopPoint.extracost,
                    isPickUp: newStopPoint.isPickUp
                })
                if (createdStopPoint) {
                    resolve({
                        status: 200,
                        message: 'Thêm điểm dừng thành công!',
                        data: createdStopPoint
                    })
                }
            }



        } catch (e) {

            reject(e)
        }
    })
}

const createRoute = (newRoute) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkBusOwner = await BusOwner.findById(newRoute.busOwnerId)
            if (checkBusOwner === null) {
                resolve({
                    status: 404,
                    message: 'Nhà xe không tồn tại!',
                })
                return;
            }

            const createdRoute = await Route.create({
                busOwnerId: newRoute.busOwnerId,
                provinceStart: newRoute.provinceStart,
                districtStart: newRoute.districtStart,
                provinceEnd: newRoute.provinceEnd,
                districtEnd: newRoute.districtEnd,
                journeyTime: newRoute.journeyTime
            })
            if (createdRoute) {
                for (const item of newRoute.listPickUpPoint) {
                    await StopPoint.create({
                        routeId: createdRoute._id,
                        locationId: item.locationId,
                        timeFromStart: item.timeFromStart,
                        extracost: item.extracost,
                        isPickUp: true
                    })
                }
                for (const item of newRoute.listDropOffPoint) {
                    await StopPoint.create({
                        routeId: createdRoute._id,
                        locationId: item.locationId,
                        timeFromStart: item.timeFromStart,
                        extracost: item.extracost,
                        isPickUp: false
                    })
                }
            }

            resolve({
                status: 200,
                message: 'Thêm tuyến đường thành công!',
                data: createdRoute
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getRoutesByBusOwner = (busOwnerId) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkBusOwner = await BusOwner.findById(busOwnerId)
            if (checkBusOwner === null) {
                resolve({
                    status: 404,
                    message: 'Nhà xe không tồn tại!',
                })
                return;
            }

            const listRoute = await Route.find({ busOwnerId: busOwnerId }).sort({ createdAt: -1, updatedAt: -1 })
            resolve({
                status: 200,
                message: 'Lấy danh sách tuyến đường theo nhà xe thành công!',
                data: listRoute
            })



        } catch (e) {

            reject(e)
        }
    })
}

const getStopPointsByBusRoute = (routeId) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkRoute = await Route.findById(routeId)
            if (checkRoute === null) {
                resolve({
                    status: 404,
                    message: 'Tuyến đường không tồn tại!',
                })
                return;
            }
            let listPickUpPoint = []
            let listDropOffPoint = []
            await StopPoint.find({ routeId: routeId })
                .populate('locationId')
                .sort({ timeFromStart: 1 })
                .then(stopPoints => {
                    for (const item of stopPoints) {
                        if (item.isPickUp)
                            listPickUpPoint.push({
                                id: item._id,
                                province: item.locationId?.province,
                                district: item.locationId?.district,
                                place: item.locationId?.place,
                                timeFromStart: item.timeFromStart,
                                extracost: item.extracost
                            })
                        else listDropOffPoint.push({
                            id: item._id,
                            province: item.locationId?.province,
                            district: item.locationId?.district,
                            place: item.locationId?.place,
                            timeFromStart: item.timeFromStart,
                            extracost: item.extracost
                        })
                    }
                })
            resolve({
                status: 200,
                message: 'Lấy danh sách điểm dừng theo tuyến xe thành công!',
                data: { listPickUpPoint, listDropOffPoint }
            })



        } catch (e) {

            reject(e)
        }
    })
}

const deleteStopPoint = (stopPointId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkStopPoint = await StopPoint.findOne({
                _id: stopPointId
            })
            if (checkStopPoint === null) {
                resolve({
                    status: 404,
                    message: 'Điểm dừng không tồn tại!'
                })
                return;
            }

            await StopPoint.findByIdAndDelete(stopPointId)
            resolve({
                status: 200,
                message: 'Xóa điểm dừng thành công!',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteRoute = (routeId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkRoute = await Route.findOne({
                _id: routeId
            })
            if (checkRoute === null) {
                resolve({
                    status: 404,
                    message: 'Tuyến đường không tồn tại!'
                })
                return;
            }

            await StopPoint.deleteMany({ routeId: routeId })
            await Trip.deleteMany({ routeId: routeId })
            await Route.findByIdAndDelete(routeId)
            resolve({
                status: 200,
                message: 'Xóa tuyến đường thành công!',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updateRoute = (routeId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { provinceStart, districtStart, provinceEnd, districtEnd, journeyTime } = data
            const checkRoute = await Route.findOne({
                _id: routeId
            })
            if (checkRoute === null) {
                resolve({
                    status: 404,
                    message: 'Tuyến đường không tồn tại!'
                })
                return;
            }

            const updatedRoute = await Route.findByIdAndUpdate(routeId, { provinceStart, districtStart, provinceEnd, districtEnd, journeyTime }, { new: true })
            resolve({
                status: 200,
                message: 'Chỉnh sửa tuyến đường thành công!',
                data: updatedRoute
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllPlace = (province, district) => {
    return new Promise(async (resolve, reject) => {
        try {
            const listPlace = await Location.distinct('place', { province: province, district: district })
            resolve({
                status: 200,
                message: 'Lấy danh sách địa điểm thành công!',
                data: listPlace
            })
        } catch (e) {
            reject(e)
        }
    })
}







module.exports = {
    addLocation,
    addStopPoint,
    createRoute,
    getRoutesByBusOwner,
    getStopPointsByBusRoute,
    deleteStopPoint,
    deleteRoute,
    updateRoute,
    getAllPlace
}