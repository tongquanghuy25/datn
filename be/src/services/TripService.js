const { User, Route, Driver, BusOwner, Trip, StopPoint, Bus, OrderTicket, OrderGoods } = require("../models/index");
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
                where: { driverId: driverId, status: 'Đã khởi hành' },
                include: [
                    { model: Route, as: 'route', required: true },
                    { model: Bus, as: 'bus', required: true }
                ]
            });
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
                            ]
                        }
                    },
                    {
                        model: BusOwner,
                        as: 'busOwner',
                        include: {
                            model: User,
                            as: 'user'
                        }
                    },
                    {
                        model: Bus,
                        as: 'bus',
                    }
                ],
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('DATE', sequelize.col('departureDate')), date),
                    ]
                },
                raw: true
            });
            console.log(allTrip);

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

const getTripsByFilter = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // const { provinceStart, districtStart, provinceEnd, districtEnd, date, order, placesEnd, placesStart, priceRange, isRecliningSeat, minRating } = data

            // const routeIds = await Route.find(data).select('id')

            // let routeIdFinal = []

            // if (placesEnd?.length > 0 || placesStart?.length > 0) {
            //     if (placesStart?.length > 0) {
            //         routeIdFinal = await StopPoint.
            //             find({
            //                 routeId: { $in: routeIds },
            //                 locationId: { $in: placesStart },
            //                 isPickUp: true
            //             })
            //             .distinct('routeId')
            //     }

            //     if (placesEnd?.length > 0) {


            //         let routes = await StopPoint.
            //             find({
            //                 routeId: { $in: routeIds },
            //                 locationId: { $in: placesEnd },
            //                 isPickUp: false
            //             })
            //             .distinct('routeId')

            //         const routesString = routes.map(route => route.toString());
            //         routeIdFinal = routeIdFinal.filter(item => routesString.includes(item.toString()))

            //     }
            // } else routeIdFinal = routeIds


            // let filterBus = {}
            // if (isRecliningSeat === 'true' || isRecliningSeat === 'false') {
            //     filterBus = { isRecliningSeat: JSON.parse(isRecliningSeat) }
            // }

            // if (minRating) {
            //     filterBus = { ...filterBus, averageRating: { $gt: parseInt(minRating) } }
            // }

            // let busIds = []
            // if (JSON.stringify(filterBus) !== '{}') {
            //     busIds = await Bus.find(filterBus).select('id')

            // }


            // let filterTrip = {
            //     departureDate: date,
            //     routeId: { $in: routeIdFinal },
            //     ticketPrice: { $gt: priceRange[0], $lt: priceRange[1] }
            //     // status: 'Chưa khởi hành'

            // }
            // if (JSON.stringify(filterBus) !== '{}') filterTrip = { ...filterTrip, busId: { $in: busIds } }



            // let orderTrip = {}
            // if (order === 'price_asc') {
            //     orderTrip = { ticketPrice: 1 }
            // } else if (order === 'price_desc') {
            //     orderTrip = { ticketPrice: -1 }

            // } else if (order === 'time_asc') {
            //     orderTrip = { departureTime: 1 }

            // } else if (order === 'time_desc') {
            //     orderTrip = { departureTime: -1 }

            // }


            // const allTrip = await Trip.
            //     find(filterTrip)
            //     .populate('busId')
            //     .populate('busOwnerId')
            //     .populate({
            //         path: 'routeId'
            //     })
            //     .sort(orderTrip)

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


            const { provinceStart, districtStart, provinceEnd, districtEnd, date, order, placesEnd, placesStart, priceRange, isRecliningSeat, minRating } = data;

            const whereConditions = {
                provinceStart,
                provinceEnd
            };

            if (districtStart) {
                whereConditions.districtStart = districtStart;
            }

            if (districtEnd) {
                whereConditions.districtEnd = districtEnd;
            }

            // Tìm các routeIds phù hợp
            const routeIds = await Route.findAll({
                where: whereConditions,
                attributes: ['id']
            });

            let routeIdFinal = [];

            if (placesEnd?.length > 0 || placesStart?.length > 0) {
                if (placesStart?.length > 0) {
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
                    const endStopPoints = await StopPoint.findAll({
                        where: {
                            routeId: routeIds.map(route => route.id),
                            locationId: placesEnd,
                            isPickUp: false
                        },
                        attributes: ['routeId'],
                        group: ['routeId']
                    });
                    routeIdFinal = routeIdFinal.filter(routeId => endStopPoints.some(stopPoint => stopPoint.routeId === routeId));
                }
            } else {
                routeIdFinal = routeIds.map(route => route.id);
            }

            let filterBus = {};
            if (isRecliningSeat === 'true' || isRecliningSeat === 'false') {
                filterBus.isRecliningSeat = JSON.parse(isRecliningSeat);
            }

            if (minRating) {
                filterBus.averageRating = { [sequelize.Op.gt]: parseInt(minRating) };
            }

            let busIds = [];
            if (Object.keys(filterBus).length > 0) {
                const buses = await Bus.findAll({
                    where: filterBus,
                    attributes: ['id']
                });
                busIds = buses.map(bus => bus.id);
            }

            let filterTrip = {
                departureDate: date,
                routeId: { [sequelize.Op.in]: routeIdFinal },
                ticketPrice: { [sequelize.Op.gt]: priceRange[0], [sequelize.Op.lt]: priceRange[1] }
            };

            if (busIds.length > 0) {
                filterTrip.busId = { [sequelize.Op.in]: busIds };
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
                where: filterTrip,
                include: [
                    { model: Bus, as: 'bus' },
                    { model: BusOwner, as: 'busOwner' },
                    { model: Route, as: 'route' }
                ],
                order: orderTrip
            });

            console.log(allTrip);

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
            if (status === 'Đã khởi hành') {
                const trip = await Trip.findOne({ status: status, driverId: driverId })
                if (trip !== null) {
                    resolve({
                        status: 400,
                        message: 'Tài xế đang có chuyến chưa hoàn thành!'
                    })
                    return;
                }
            }

            const checkTrip = await Trip.findOne({
                id: tripId
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
                data: updatedTrip
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
                id: tripId
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
    getTripsByFilter,
    getAllByDriver,
    getRunningByDriver,
    updateFinishTrip
}