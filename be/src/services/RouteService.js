const Route = require("../models/RouteModel");
const StopPoint = require("../models/StopPointModel");
const Location = require("../models/LocationModel");
const BusOwner = require("../models/BusOwnerModel");


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
                        status: 'OK',
                        message: 'Thêm địa điểm thành công!',
                        data: createdLocation
                    })
                }
            } else {
                resolve({
                    status: 'OK',
                    message: 'Địa điểm đã tồn tại!',
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
                        status: 'OK',
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
                        status: 'OK',
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
                    status: 'ERR',
                    message: 'Nhà xe không tồn tại!',
                })
            }

            const createdRoute = await Route.create({
                busOwnerId: newRoute.busOwnerId,
                provinceStart: newRoute.provinceStart,
                districtStart: newRoute.districtStart,
                provinceEnd: newRoute.provinceEnd,
                districtEnd: newRoute.districtEnd
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
                status: 'OK',
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
                    status: 'OK',
                    message: 'Nhà xe không tồn tại!',
                })
            }

            const listRoute = await Route.find({ busOwnerId: busOwnerId }).sort({ createdAt: -1, updatedAt: -1 })
            resolve({
                status: 'OK',
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
                    status: 'OK',
                    message: 'Tuyến đường không tồn tại!',
                })
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
                status: 'OK',
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
                    status: 'ERR',
                    message: 'Điểm dừng không tồn tại!'
                })
            }

            await StopPoint.findByIdAndDelete(stopPointId)
            resolve({
                status: 'OK',
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
                    status: 'ERR',
                    message: 'Tuyến đường không tồn tại!'
                })
            }

            await StopPoint.deleteMany({ routeId: routeId })
            await Route.findByIdAndDelete(routeId)
            resolve({
                status: 'OK',
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
            const { provinceStart, districtStart, provinceEnd, districtEnd } = data
            const checkRoute = await Route.findOne({
                _id: routeId
            })
            if (checkRoute === null) {
                resolve({
                    status: 'ERR',
                    message: 'Tuyến đường không tồn tại!'
                })
            }

            const updatedRoute = await Route.findByIdAndUpdate(routeId, { provinceStart, districtStart, provinceEnd, districtEnd }, { new: true })
            resolve({
                status: 'OK',
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
                status: 'OK',
                message: 'Lấy danh sách địa điểm thành công!',
                data: listPlace
            })
        } catch (e) {
            reject(e)
        }
    })
}


const createBus = (newBus) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkBusOwner = await BusOwner.findOne({
                busOwnerId: newBus.busOwnerId
            })
            if (checkBusOwner === null) {

                resolve({
                    status: 'ERR',
                    message: 'Nhà xe không tồn tại'
                })
            }

            const createdBus = await Bus.create(newBus)

            if (createdBus) {
                resolve({
                    status: 'OK',
                    message: 'Thêm xe thành công !',
                    data: createdBus
                })
            }
        } catch (e) {

            reject(e)
        }
    })
}


const getBussByBusOwner = (busOwnerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const allBus = await Bus.find({ busOwnerId: busOwnerId }).sort({ createdAt: -1, updatedAt: -1 })
            resolve({
                status: 'OK',
                message: 'Success',
                data: allBus
            })

        } catch (e) {
            reject(e)
        }
    })
}

// const updateBus = (busId, data) => {
//     return new Promise(async (resolve, reject) => {
//         try {


//             const checkBus = await Bus.findOne({
//                 _id: busId
//             })
//             if (checkBus === null) {
//                 resolve({
//                     status: 'ERR',
//                     message: 'Xe không tồn tại!'
//                 })
//             }

//             const updatedBus = await Bus.findByIdAndUpdate(busId, { ...data }, { new: true })
//             if (updatedBus && data.deleteImages?.length > 0) {
//                 for (const img of data.deleteImages) {
//                     await deleteImgCloud({ path: img })
//                 }
//             }
//             resolve({
//                 status: 'OK',
//                 message: 'Cập nhật thông tin xe thành công!',
//                 data: updateBus
//             })
//         } catch (e) {
//             console.log(e);
//             reject(e)
//         }
//     })
// }




const getAllDriver = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const allDriver = await Driver.find({ isAccept: true }).populate('userId', 'email phone').sort({ createdAt: -1, updatedAt: -1 })

            resolve({
                status: 'OK',
                message: 'Success',
                data: allDriver
            })
        } catch (e) {
            reject(e)
        }
    })
}

const findBusOwnerIdByUserId = async (id) => {
    try {
        const busOwner = await BusOwner.findOne({ userId: id });
        if (busOwner) {
            return busOwner._id;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Lỗi khi tìm BusOwner:', error);
        throw error;
    }
}

const editBusOwner = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkBusOwner = await BusOwner.findOne({
                _id: id
            })
            if (checkBusOwner === null) {
                resolve({
                    status: 'ERR',
                    message: 'NNhà xe không tồn tại !'
                })
            }

            const updatedBusOwner = await BusOwner.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedBusOwner
            })
        } catch (e) {
            reject(e)
        }
    })
}


const getAllBusOwnerNotAccept = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const allBusOwnerNotAccept = await BusOwner.find({ isAccept: false }).populate('userId').sort({ createdAt: -1, updatedAt: -1 })
            resolve({
                status: 'OK',
                message: 'Success',
                data: allBusOwnerNotAccept
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