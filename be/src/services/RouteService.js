const { BusOwner, Location, StopPoint, Route, Trip } = require("../models/index");

const addLocation = (newLocation) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkLocation = await Location.findOne({
                where: { province: newLocation.province, district: newLocation.district, place: newLocation.place },
                raw: true
            });
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
                where: { province: newStopPoint.province, district: newStopPoint.district, place: newStopPoint.place },
                raw: true
            });
            if (checkLocation === null) {
                const createdLocation = await Location.create({
                    province: newStopPoint.province,
                    district: newStopPoint.district,
                    place: newStopPoint.place
                })

                const createdStopPoint = await StopPoint.create({
                    routeId: newStopPoint.routeId,
                    locationId: createdLocation.id,
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
                    locationId: checkLocation.id,
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

            const checkBusOwner = await BusOwner.findByPk(newRoute.busOwnerId);
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
                placeStart: newRoute.placeStart,
                provinceEnd: newRoute.provinceEnd,
                districtEnd: newRoute.districtEnd,
                placeEnd: newRoute.placeEnd,
                journeyTime: newRoute.journeyTime
            })
            if (createdRoute) {
                for (const item of newRoute.listPickUpPoint) {
                    await StopPoint.create({
                        routeId: createdRoute.id,
                        locationId: item.locationId,
                        timeFromStart: item.timeFromStart,
                        extracost: item.extracost,
                        isPickUp: true
                    })
                }
                for (const item of newRoute.listDropOffPoint) {
                    await StopPoint.create({
                        routeId: createdRoute.id,
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
            const checkBusOwner = await BusOwner.findByPk(busOwnerId);
            if (checkBusOwner === null) {
                resolve({
                    status: 404,
                    message: 'Nhà xe không tồn tại!',
                })
                return;
            }

            const listRoute = await Route.findAll({
                where: { busOwnerId: busOwnerId },
                order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']]
            });
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
            const checkRoute = await Route.findByPk(routeId);
            if (checkRoute === null) {
                resolve({
                    status: 404,
                    message: 'Tuyến đường không tồn tại!',
                })
                return;
            }
            let listPickUpPoint = [];
            let listDropOffPoint = [];

            const stopPoints = await StopPoint.findAll({
                where: { routeId: routeId },
                include: {
                    model: Location,
                    as: 'location',
                    // attributes: ['province', 'district', 'place']
                },
                order: [['timeFromStart', 'ASC']],
            });

            for (const item of stopPoints) {
                const point = {
                    id: item.id,
                    province: item.location?.province,
                    district: item.location?.district,
                    place: item.location?.place,
                    timeFromStart: item.timeFromStart,
                    extracost: item.extracost
                };

                if (item.isPickUp) {
                    listPickUpPoint.push(point);
                } else {
                    listDropOffPoint.push(point);
                }
            }

            resolve({
                status: 200,
                message: 'Lấy danh sách điểm dừng theo tuyến xe thành công!',
                data: { listPickUpPoint, listDropOffPoint }
            })



        } catch (e) {
            console.log(e);

            reject(e)
        }
    })
}

const deleteStopPoint = (stopPointId) => {
    return new Promise(async (resolve, reject) => {
        try {

            const checkStopPoint = await StopPoint.findOne({ where: { id: stopPointId } });
            if (checkStopPoint === null) {
                resolve({
                    status: 404,
                    message: 'Điểm dừng không tồn tại!'
                })
                return;
            }

            await StopPoint.destroy({ where: { id: stopPointId } });
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
            const checkRoute = await Route.findByPk(routeId);
            if (checkRoute === null) {
                resolve({
                    status: 404,
                    message: 'Tuyến đường không tồn tại!'
                })
                return;
            }

            await Route.destroy({ where: { id: routeId } });

            resolve({
                status: 200,
                message: 'Xóa tuyến đường thành công!',
            })
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const updateRoute = (routeId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { provinceStart, districtStart, provinceEnd, districtEnd, journeyTime, placeStart, placeEnd } = data

            const checkRoute = await Route.findByPk(routeId);
            if (checkRoute === null) {
                resolve({
                    status: 404,
                    message: 'Tuyến đường không tồn tại!'
                })
                return;
            }

            await Route.update({ provinceStart, districtStart, provinceEnd, districtEnd, journeyTime, placeStart, placeEnd }, { where: { id: routeId } });
            resolve({
                status: 200,
                message: 'Chỉnh sửa tuyến đường thành công!',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllPlace = (province, district) => {
    return new Promise(async (resolve, reject) => {
        try {
            const listPlace = await Location.findAll({
                attributes: ['place'],
                where: { province: province, district: district }
            });

            resolve({
                status: 200,
                message: 'Lấy danh sách địa điểm thành công!',
                data: listPlace
            })
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const getPlacesBySearchTrip = (data) => {
    const formatArr = (arr) => {
        const districtMap = {};
        arr.forEach(location => {
            const { id, district, place } = location;

            if (!districtMap[district]) {
                districtMap[district] = [];
            }

            districtMap[district].push({ id, place });
        });

        // Chuyển đổi đối tượng thành mảng
        const districtArray = Object.entries(districtMap).map(([district, locations]) => ({ [district]: locations }));

        return districtArray
    }

    return new Promise(async (resolve, reject) => {
        try {
            let listPlaceStart, listPlaceEnd

            if (data?.districtStart) {
                listPlaceStart = await Location.findAll({
                    where: { province: data?.provinceStart, district: data?.districtStart },
                    attributes: ['id', 'district', 'place']
                });
            } else {
                listPlaceStart = await Location.findAll({
                    where: { province: data?.provinceStart },
                    attributes: ['id', 'district', 'place']
                });
            }

            if (data?.districtEnd) {
                listPlaceEnd = await Location.findAll({
                    where: { province: data?.provinceEnd, district: data?.districtEnd },
                    attributes: ['id', 'district', 'place']
                });
            } else {
                listPlaceEnd = await Location.findAll({
                    where: { province: data?.provinceEnd },
                    attributes: ['id', 'district', 'place']
                });
            }


            listPlaceStart = formatArr(listPlaceStart)
            listPlaceEnd = formatArr(listPlaceEnd)
            resolve({
                status: 200,
                message: 'Lấy danh sách địa điểm thành công!',
                data: { listPlaceStart, listPlaceEnd }
            })
        } catch (e) {
            console.log(e);
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
    getAllPlace,
    getPlacesBySearchTrip
}