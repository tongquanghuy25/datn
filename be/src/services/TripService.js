const { User, Route, Driver, BusOwner, Trip, StopPoint, Bus, OrderTicket, OrderGoods, Location } = require("../models/index");
const sequelize = require('sequelize');
const { Op } = require('sequelize');

const createTrip = (dates, newTrip) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkBusOwner = await BusOwner.findByPk(newTrip.busOwnerId);
            if (checkBusOwner === null) {
                resolve({
                    status: 400,
                    message: 'Nhà xe không tồn tại'
                })
                return;
            }
            console.log(newTrip);
            for (const date of dates) {
                await Trip.create({ ...newTrip, departureDate: date })
            }
            resolve({
                status: 200,
                message: 'Thêm chuyến thành công !',
            })
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const getAllByBusOwner = (busOwnerId, day) => {
    return new Promise(async (resolve, reject) => {
        try {
            const allTrip = await Trip.findAll({
                where: {
                    [Op.and]: [
                        { busOwnerId: busOwnerId, },
                        sequelize.where(sequelize.fn('DATE', sequelize.col('departureDate')), day),
                    ]
                },
                include: [
                    { model: Route, as: 'route', required: true },
                    { model: Bus, as: 'bus', required: true },
                    {
                        model: Driver,
                        as: 'driver',
                        attributes: { exclude: ['busOwnerId', 'tripNumber'] },
                        include: { model: User, as: 'user', attributes: ['name'] }
                    }
                ],
                order: [['departureTime', 'DESC']]
            });
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

const getAllByDriver = (driverId, day) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(driverId, day);
            const allTrip = await Trip.findAll({
                where: {
                    [Op.and]: [
                        { driverId: driverId, },
                        sequelize.where(sequelize.fn('DATE', sequelize.col('departureDate')), day),
                    ]
                },
                include: [
                    { model: Route, as: 'route', required: true },
                    { model: Bus, as: 'bus', required: true },
                ],
                order: [['departureTime', 'DESC']]
            });
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

            const trip = await Trip.findOne({
                where: { driverId: driverId, status: 'Started' },
                include: [
                    { model: Route, as: 'route', required: true },
                    { model: Bus, as: 'bus', required: true }
                ]
            });
            //await OrderTicket.update({ payee: 120 }, { where: { tripId: trip.id } });
            const listTicketOrder = await OrderTicket.findAll({ where: { tripId: trip.id } });
            const listGoodsOrder = await OrderGoods.findAll({ where: { tripId: trip.id } });
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
            const { provinceStart, districtStart, provinceEnd, districtEnd, date } = data;

            const allTrip = await Trip.findAll({
                include: [
                    {
                        model: Route,
                        as: 'route',
                        where: {
                            [Op.and]: [
                                { provinceStart: provinceStart },
                                { provinceEnd: provinceEnd },
                                districtStart ? { districtStart: districtStart } : null,
                                districtEnd ? { districtEnd: districtEnd } : null
                            ].filter(condition => condition !== null)
                        },
                        attributes: ['placeStart', 'districtStart', 'placeEnd', 'districtEnd', 'journeyTime']

                    },
                    {
                        model: BusOwner,
                        as: 'busOwner',
                        include: {
                            model: User,
                            as: 'user',
                            attributes: ['phone']
                        },
                        attributes: ['busOwnerName', 'averageRating', 'reviewCount']

                    },
                    {
                        model: Bus,
                        as: 'bus',
                        attributes: ['avatar', 'images', 'typeBus', 'convinients']
                    }
                ],
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('DATE', sequelize.col('departureDate')), date),
                        { status: "NotStarted" }
                    ]
                },
                // raw: true
            });

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


//NOTE
const getInforFilterTrip = (data) => {
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
            const { provinceStart, districtStart, provinceEnd, districtEnd, date } = data;

            if (districtStart) {
                listPlaceStart = await Location.findAll({
                    where: { province: provinceStart, district: districtStart },
                    attributes: ['id', 'district', 'place']
                });
            } else {
                listPlaceStart = await Location.findAll({
                    where: { province: provinceStart },
                    attributes: ['id', 'district', 'place']
                });
            }

            if (districtEnd) {
                listPlaceEnd = await Location.findAll({
                    where: { province: provinceEnd, district: districtEnd },
                    attributes: ['id', 'district', 'place']
                });
            } else {
                listPlaceEnd = await Location.findAll({
                    where: { province: provinceEnd },
                    attributes: ['id', 'district', 'place']
                });
            }


            listPlaceStart = formatArr(listPlaceStart)
            listPlaceEnd = formatArr(listPlaceEnd)


            let listBusOwner = await Trip.findAll({
                include: [
                    {
                        model: Route,
                        as: 'route',
                        attributes: [],
                        where: {
                            [Op.and]: [
                                { provinceStart: provinceStart },
                                { provinceEnd: provinceEnd },
                                districtStart ? { districtStart: districtStart } : null,
                                districtEnd ? { districtEnd: districtEnd } : null
                            ].filter(condition => condition !== null)
                        }
                    },
                    {
                        model: BusOwner,
                        as: 'busOwner',
                        attributes: ['id', 'busOwnerName']
                    },

                ],
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('DATE', sequelize.col('departureDate')), date),
                    ]
                },
                attributes: [[sequelize.fn('DISTINCT', sequelize.col('busOwner.busOwnerName')), 'busOwnerName']],
                raw: true
            });

            listBusOwner = listBusOwner.map(item => { return { id: item['busOwner.id'], busOwnerName: item['busOwner.busOwnerName'] } })

            resolve({
                status: 200,
                message: 'Lấy danh sách địa điểm thành công!',
                data: { listPlaceStart, listPlaceEnd, listBusOwner }
            })
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const getTripsByFilter = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { provinceStart, districtStart, provinceEnd, districtEnd, date, order, priceRange, seatOption, busOwnerSelected, minRating } = data;
            let { placesEnd, placesStart } = data

            const routeIds = await Route.findAll({
                where: {
                    [Op.and]: [
                        { provinceStart: provinceStart },
                        { provinceEnd: provinceEnd },
                        districtStart ? { districtStart: districtStart } : null,
                        districtEnd ? { districtEnd: districtEnd } : null
                    ].filter(condition => condition !== null)
                },
                attributes: ['id'],
                raw: true
            });

            let routeIdFinal = [];
            if (placesEnd?.length > 0 || placesStart?.length > 0) {
                if (placesStart?.length > 0) {
                    placesStart = placesStart.map(item => parseInt(item))
                    const startStopPoints = await StopPoint.findAll({
                        where: {
                            routeId: routeIds.map(route => route.id),
                            locationId: placesStart,
                            isPickUp: true
                        },
                        attributes: ['routeId'],
                        group: ['routeId']
                    });
                    routeIdFinal = startStopPoints.map(stopPoint => stopPoint.routeId);
                }

                if (placesEnd?.length > 0) {
                    placesEnd = placesEnd.map(item => parseInt(item))
                    const endStopPoints = await StopPoint.findAll({
                        where: {
                            routeId: routeIds.map(route => route.id),
                            locationId: placesEnd,
                            isPickUp: false
                        },
                        attributes: ['routeId'],
                        group: ['routeId']
                    });
                    if (placesStart?.length > 0) routeIdFinal = routeIdFinal.filter(routeId => endStopPoints.some(stopPoint => stopPoint.routeId === routeId));
                    else routeIdFinal = endStopPoints.map(stopPoint => stopPoint.routeId);

                }
            } else {
                routeIdFinal = routeIds.map(route => route.id);
            }

            let orderTrip = [];
            if (order === 'price_asc') {
                orderTrip = [['ticketPrice', 'ASC']];
            } else if (order === 'price_desc') {
                orderTrip = [['ticketPrice', 'DESC']];
            } else if (order === 'time_asc') {
                orderTrip = [['departureTime', 'ASC']];
            } else if (order === 'time_desc') {
                orderTrip = [['departureTime', 'DESC']];
            }


            const allTrip = await Trip.findAll({
                include: [
                    {
                        model: Route,
                        as: 'route',
                        where: {
                            id: { [Op.in]: routeIdFinal }
                        },
                        attributes: ['placeStart', 'districtStart', 'placeEnd', 'districtEnd', 'journeyTime']
                    },
                    {
                        model: BusOwner,
                        as: 'busOwner',
                        where: {
                            [Op.and]: [
                                busOwnerSelected && busOwnerSelected.length > 0 ? { id: { [Op.in]: busOwnerSelected } } : null,
                                minRating ? { averageRating: { [Op.gte]: parseInt(minRating) } } : null
                            ].filter(condition => condition !== null)
                        },
                        attributes: ['busOwnerName', 'averageRating', 'reviewCount']
                    },
                    {
                        model: Bus,
                        as: 'bus',
                        where: {
                            [Op.and]: [
                                seatOption && seatOption.length > 0 ? { typeSeat: { [Op.in]: seatOption } } : null,
                            ].filter(condition => condition !== null)
                        },
                        attributes: ['avatar', 'images', 'typeBus', 'convinients']
                    }
                ],
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('DATE', sequelize.col('departureDate')), date),
                        { ticketPrice: { [sequelize.Op.gt]: priceRange[0], [sequelize.Op.lt]: priceRange[1] } },
                    ]
                },
                order: orderTrip,
            });


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

            const { status, driverId } = data
            if (status === 'Started') {
                const trip = await Trip.findOne({
                    where: {
                        status: status,
                        driverId: driverId
                    }
                });
                if (trip !== null) {
                    resolve({
                        status: 400,
                        message: 'Tài xế đang có chuyến chưa hoàn thành!'
                    })
                    return;
                }
            }

            const checkTrip = await Trip.findOne({
                where: {
                    id: tripId
                }
            });
            if (checkTrip === null) {
                resolve({
                    status: 404,
                    message: 'Chuyến xe không tồn tại!'
                })
                return;
            }

            await Trip.update(data, {
                where: {
                    id: tripId
                }
            });
            resolve({
                status: 200,
                message: 'Cập nhật thông tin chuyến thành công!',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updateFinishTrip = (tripId) => {
    return new Promise(async (resolve, reject) => {
        try {

            const checkTrip = await Trip.findOne({
                where: {
                    id: tripId
                }
            });
            if (checkTrip === null) {
                resolve({
                    status: 404,
                    message: 'Chuyến xe không tồn tại!'
                })
                return;
            }
            //6631f6867b09020fcdd9815d
            await Trip.update({ status: 'Ended' }, {
                where: {
                    id: tripId
                }
            });
            resolve({
                status: 200,
                message: 'Kết thúc chuyến xe thành công!',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteTrip = (tripId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Trip.destroy({
                where: {
                    id: tripId
                }
            });
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
    getInforFilterTrip,
    getTripsByFilter,
    getAllByDriver,
    getRunningByDriver,
    updateFinishTrip
}