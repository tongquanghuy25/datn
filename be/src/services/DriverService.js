const { User, BusOwner, Driver, Route, Trip, OrderTicket, OrderGoods } = require("../models/index");
const { deleteImgCloud } = require("../utils");
const sequelize = require('sequelize');
const { Op, Sequelize } = require('sequelize');


const createDriver = (newDriver) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkBusOwner = await BusOwner.findOne({
                where: { id: newDriver.busOwnerId }
            });
            if (checkBusOwner === null) {
                resolve({
                    status: 404,
                    message: 'Nhà xe không tồn tại'
                })
                return;
            }

            const createdDriver = await Driver.create(newDriver);
            if (createdDriver) {
                resolve({
                    status: 200,
                    message: 'Đăng ký tài xế thành công !',
                })
            }
        } catch (e) {
            console.log(e);
            reject({ e, userId: newDriver.userId })
        }
    })
}

const getDriversByBusOwner = (busOwnerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const allDriver = await Driver.findAll({
                where: { busOwnerId: busOwnerId },
                include: [{
                    model: User,
                    as: 'user',
                    // attributes: ['email', 'name', 'phone', 'avatar']
                }],
                order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']]
            });
            resolve({
                status: 200,
                message: 'Success',
                data: allDriver
            })
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const getDriversByUserId = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(userId);
            const driver = await Driver.findOne({ where: { userId: userId } })
            resolve({
                status: 200,
                message: 'Success',
                data: driver
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updateDriver = (driverId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findByPk(data.userId, { raw: true });
            if (checkUser === null) {
                resolve({
                    status: 404,
                    message: 'Người dùng không tồn tại!'
                })
                return;
            }
            if (data.email) {
                const checkEmail = await User.findOne({
                    where: { email: data?.email },
                    raw: true
                });
                if (checkEmail !== null && checkEmail.email !== data?.email) {
                    resolve({
                        status: 400,
                        message: 'Email đã tồn tại!'
                    })
                    return;
                }
            }
            await User.update(data, {
                where: { id: data.userId }
            });

            if (checkUser?.avatar && data.avatar) {
                deleteImgCloud({ path: checkUser?.avatar })
            }
            await Driver.update(data, {
                where: { id: driverId }
            });
            resolve({
                status: 200,
                message: 'Chỉnh sửa tài xế thành công!',
            })
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const deleteDriver = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkDriver = await Driver.findOne({ where: { userId: id } });
            if (checkDriver === null) {
                resolve({
                    status: 404,
                    message: 'Tài xế không tồn tại!'
                })
                return;
            }
            const checkUser = await User.findOne({ where: { id: id }, raw: true });
            if (checkUser === null) {
                resolve({
                    status: 404,
                    message: 'Tài khoản tài xế không tồn tại!'
                })
                return;
            }

            await Driver.destroy({ where: { userId: id } });
            if (checkUser?.avatar) deleteImgCloud({ path: checkUser?.avatar })
            await User.destroy({ where: { id: id } });
            resolve({
                status: 200,
                message: 'Xóa tài xế thành công!',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllDriver = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allDriver = await Driver.findAll({
                include: [{
                    model: User,
                }],
                order: [
                    ['createdAt', 'DESC'],
                    ['updatedAt', 'DESC']
                ]
            });
            resolve({
                status: 200,
                message: 'Success',
                data: allDriver
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getStatisticDriver = (userId, driverId, startDate, endDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            const trips = await Trip.findAll({
                attributes: [
                    'id',
                    'routeId',
                    'departureDate',
                    'departureTime',
                    [sequelize.literal('(SELECT COUNT(*) FROM OrderTickets WHERE OrderTickets.tripId = Trip.id)'), 'ticketOrders'],
                    [sequelize.literal('(SELECT SUM(totalPrice) FROM OrderTickets WHERE OrderTickets.tripId = Trip.id  AND OrderTickets.payee = :userId)'), 'ticketAmount'],
                    [sequelize.literal('(SELECT COUNT(*) FROM OrderGoods WHERE OrderGoods.tripId = Trip.id)'), 'goodsOrders'],
                    [sequelize.literal('(SELECT SUM(price) FROM OrderGoods WHERE OrderGoods.tripId = Trip.id  AND OrderGoods.payee = :userId)'), 'goodsAmount'],
                ],
                where: {
                    driverId: 6,
                    departureDate: {
                        [sequelize.Op.and]: [
                            { [sequelize.Op.gte]: new Date(startDate) }, // Lớn hơn hoặc bằng startDate
                            { [sequelize.Op.lt]: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)) } // Nhỏ hơn endDate + 1 ngày
                        ]
                    }
                },
                replacements: { userId },
                include: [
                    {
                        model: Route,
                        as: 'route',
                        attributes: ['districtStart', 'districtEnd', 'provinceEnd', 'provinceStart'],
                    },
                ],
            });

            const tripDetails = trips.map(trip => ({
                route: ` ${trip.route.districtStart}, ${trip.route.provinceStart} -> ${trip.route.districtEnd}, ${trip.route.provinceEnd} `,
                id: trip.id,
                departureDate: trip.departureDate,
                departureTime: trip.departureTime,
                ticketOrders: trip.dataValues.ticketOrders,
                ticketAmount: trip.dataValues.ticketAmount ? trip.dataValues.ticketAmount : 0,
                goodsOrders: trip.dataValues.goodsOrders,
                goodsAmount: trip.dataValues.goodsAmount ? trip.dataValues.goodsAmount : 0,
            }));

            const tripId = tripDetails.map(trip => trip.id);

            // Fetch total ticket orders and total ticket amount collected by driver
            const ticketStats = await OrderTicket.findAll({
                attributes: [
                    [sequelize.fn('COUNT', sequelize.col('id')), 'totalTickets'],
                    [sequelize.fn('SUM', sequelize.col('totalPrice')), 'totalTicketAmount'],
                ],
                where: {
                    payee: userId,
                    tripId: { [Op.in]: tripId }
                },
            });

            const totalTickets = ticketStats[0].dataValues.totalTickets;
            const totalTicketAmount = ticketStats[0].dataValues.totalTicketAmount ? ticketStats[0].dataValues.totalTicketAmount : 0;

            // Fetch total goods orders and total goods amount collected by driver
            const goodsStats = await OrderGoods.findAll({
                attributes: [
                    [sequelize.fn('COUNT', sequelize.col('id')), 'totalGoods'],
                    [sequelize.fn('SUM', sequelize.col('price')), 'totalGoodsAmount'],
                ],
                where: {
                    Payee: userId,
                    tripId: { [Op.in]: tripId }
                },
            });

            const totalGoods = goodsStats[0].dataValues.totalGoods;
            const totalGoodsAmount = goodsStats[0].dataValues.totalGoodsAmount ? goodsStats[0].dataValues.totalGoodsAmount : 0;

            console.log('aa');
            resolve({
                status: 200,
                message: 'Success',
                data: {
                    tripDetails,
                    totalTrips: tripId?.length,
                    totalTickets,
                    totalTicketAmount,
                    totalGoods,
                    totalGoodsAmount,
                }
            })
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

module.exports = {
    createDriver,
    getAllDriver,
    getDriversByBusOwner,
    deleteDriver,
    updateDriver,
    getDriversByUserId,
    getStatisticDriver

}