const { User, BusOwner, Agent, Bus, Driver, Route, Trip, OrderTicket, OrderGoods, Refund } = require("../models/index");
const UserService = require('./UserService')
const sequelize = require('sequelize');
const { Op, Sequelize } = require('sequelize');

const createBusOwner = (newBusOwner) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { email, phone, password, confirmPassword, busOwnerName, address, companyType, companyDescription, managerName, citizenId, managerPhone, managerEmail } = newBusOwner
            const res = await UserService.createUser({ email, phone, password, confirmPassword })
            if (res.status !== 200) {
                resolve({
                    status: 404,
                    message: res.message
                })
                return;
            }
            const createdBusOwner = await BusOwner.create({
                userId: res?.data.id,
                busOwnerName,
                address,
                companyType,
                companyDescription,
                managerName,
                citizenId,
                managerPhone,
                managerEmail
            })

            if (createdBusOwner) {
                resolve({
                    status: 200,
                    message: 'Đăng ký nhà xe thành công!',
                    data: createdBusOwner
                })
            } else {
                await UserService.deleteUser(res?.data.id)
            }
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const getAllBusOwner = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const allBusOwner = await BusOwner.findAll({
                where: { isAccept: true },
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['email', 'phone']
                }],
                order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']]
            });

            resolve({
                status: 200,
                message: 'Success',
                data: allBusOwner
            })
        } catch (e) {
            reject(e)
        }
    })
}

const editBusOwner = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkBusOwner = await BusOwner.findOne({
                where: { id: id }
            });
            if (checkBusOwner === null) {
                resolve({
                    status: 404,
                    message: 'Nhà xe không tồn tại!'
                })
                return;
            }

            await BusOwner.update(data, {
                where: { id: id }
            });

            resolve({
                status: 200,
                message: 'Sửa nhà xe thành công!',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteBusOwner = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkBusOwner = await BusOwner.findOne({
                where: { id: id }
            });
            if (checkBusOwner === null) {
                resolve({
                    status: 404,
                    message: 'Nhà xe không tồn tại!'
                })
                return;
            }

            await BusOwner.destroy({
                where: { id: id }
            });

            await User.destroy({
                where: { id: checkBusOwner.userId }
            });
            resolve({
                status: 200,
                message: 'Xóa nhà xe thành công!',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllBusOwnerNotAccept = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allBusOwnerNotAccept = await BusOwner.findAll({
                where: { isAccept: false },
                include: [{ model: User, as: 'user' }], // Sử dụng 'user' thay vì 'userId'
                order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']]
            });

            const allAgentNotAccept = await Agent.findAll({
                where: { isAccept: false },
                include: [{ model: User, as: 'user' }],
                order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']]
            });

            const list = [...allBusOwnerNotAccept, ...allAgentNotAccept]
            list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

            resolve({
                status: 200,
                message: 'Success',
                data: list
            })
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const getDetailBusOwnerByUserId = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const busOwner = await BusOwner.findOne({
                where: { userId: id }
            });
            if (busOwner === null) {
                resolve({
                    status: 404,
                    message: 'Nhà xe không tồn tại!'
                })
                return;
            }
            resolve({
                status: 200,
                message: 'SUCESS',
                data: busOwner
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getOverviewBusOwner = (busOwnerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const numBus = await Bus.count({
                where: { busOwnerId: busOwnerId },
            });
            const numDriver = await Driver.count({
                where: { busOwnerId: busOwnerId },
            });
            const numRoute = await Route.count({
                where: { busOwnerId: busOwnerId },
            });
            resolve({
                status: 200,
                message: 'Xóa xe thành công!',
                data: {
                    numBus,
                    numDriver,
                    numRoute,
                }
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getStatisticBusOwner = (busOwnerId, tab, startDate, endDate, startOfMonth, endOfMonth, selectedYear) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('busOwnerId', busOwnerId, tab, startDate, endDate, startOfMonth, endOfMonth, selectedYear);
            let tripIds = [];
            let allTrip = [];
            if (tab === '1') {
                const trips = await Trip.findAll({
                    where: {
                        busOwnerId: busOwnerId,
                        // status: 'Ended',
                        departureDate: {
                            [sequelize.Op.and]: [
                                { [sequelize.Op.gte]: new Date(startDate) }, // Lớn hơn hoặc bằng startDate
                                { [sequelize.Op.lt]: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)) } // Nhỏ hơn endDate + 1 ngày
                            ]
                        }
                    },
                });
                allTrip = trips;
                tripIds = trips.map(trip => trip.id);
            } else if (tab === '2') {
                const trips = await Trip.findAll({
                    where: {
                        busOwnerId: busOwnerId,
                        // status: 'Ended',
                        departureDate: {
                            [sequelize.Op.and]: [
                                { [sequelize.Op.gte]: new Date(startOfMonth) }, // Lớn hơn hoặc bằng startDate
                                { [sequelize.Op.lt]: new Date(new Date(endOfMonth).setDate(new Date(endOfMonth).getDate() + 1)) } // Nhỏ hơn endDate + 1 ngày
                            ]
                        }

                    },
                });
                allTrip = trips;
                tripIds = trips.map(trip => trip.id);
            } else if (tab === '3') {
                const trips = await Trip.findAll({
                    where: {
                        busOwnerId: busOwnerId,
                        // status: 'Ended',
                        departureDate: {
                            [Op.between]: [`${selectedYear}-01-01`, `${selectedYear}-12-31`]
                        }
                    },
                });
                allTrip = trips;
                tripIds = trips.map(trip => trip.id);
            }

            // Tính tổng số lượng vé
            const totalTicketCount = await OrderTicket.sum('seatCount', {
                where: {
                    tripId: { [Op.in]: tripIds },
                    status: { [Op.notIn]: ['Canceled'] }
                }
            });

            // Tính tổng số tiền của các vé
            const totalRevenueTicket = await OrderTicket.sum('totalPrice', {
                where: {
                    tripId: { [Op.in]: tripIds },
                    status: { [Op.notIn]: ['Canceled'] }
                }
            });

            // Tính tổng số tiền của các đơn gửi hàng
            const totalRevenueGoods = await OrderGoods.sum('price', {
                where: {
                    tripId: { [Op.in]: tripIds },
                    status: { [Op.notIn]: ['Canceled'] }
                }
            });
            //  console.log('totalTicketCount', totalTicketCount, totalRevenueTicket + totalRevenueGoods);


            const occupancyRates = await Trip.findAll({
                where: {
                    id: {
                        [sequelize.Op.in]: tripIds
                    }
                },
                attributes: [
                    'routeId',
                    [sequelize.fn('sum', sequelize.col('bookedSeats')), 'totalBookedSeats'],
                    [sequelize.fn('sum', sequelize.literal('totalSeats')), 'totalSeats']
                ],
                include: [{
                    model: Route,
                    as: 'route',
                    attributes: ['provinceStart', 'districtStart', 'provinceEnd', 'districtEnd']
                }],
                group: ['routeId']
            });

            // Tính tỉ lệ lấp đầy cho từng routeId
            const occupancyRateResults = occupancyRates.map((rate, index) => {
                const percent = parseFloat(rate.dataValues.totalSeats) > 0 ? (parseInt(rate.dataValues.totalBookedSeats) / parseFloat(rate.dataValues.totalSeats)) * 100 : 0
                const route = rate.dataValues.route
                console.log(route);
                return ({
                    key: index + 1,
                    stt: index + 1,
                    route: `${route.districtStart} ,${route.provinceStart}  ->  ${route.districtEnd} ,${route.provinceEnd}`,
                    occupancyRate: parseFloat(percent.toFixed(2))
                })
            });

            console.log('occupancyRateResults', occupancyRateResults);

            resolve({
                status: 200,
                message: 'Xóa xe thành công!',
                data: {
                    numTrip: tripIds.length,
                    numTicket: totalTicketCount,
                    revenue: totalRevenueTicket + totalRevenueGoods,
                    occupancyRate: occupancyRateResults
                }
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDebtsBusOwner = (busOwnerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const trips = await Trip.findAll({
                where: {
                    busOwnerId: busOwnerId
                },
                attributes: ['id']
            });
            const drivers = await Driver.findAll({
                where: {
                    busOwnerId: busOwnerId
                },
                include: {
                    model: User,
                    as: 'user',
                    attributes: ['id']
                }
            });
            const agents = await Agent.findAll({
                include: {
                    model: User,
                    as: 'user',
                    attributes: ['id']
                }
            });

            const ticketDebts = await OrderTicket.findAll({
                attributes: [
                    'payee',
                    [Sequelize.fn('SUM', Sequelize.col('totalPrice')), 'totalDebt']
                ],
                where: {
                    tripId: {
                        [Op.in]: trips.map(trip => trip.id)
                    },
                    [Op.or]: [
                        { payee: { [Op.in]: drivers.map(driver => driver.userId) } },
                        { payee: { [Op.in]: agents.map(agent => agent.userId) } }
                    ],
                    status: { [Op.notIn]: ['Canceled'] }
                },
                group: ['payee'],
            });

            const debtsDriver = [];
            const debtsAgent = [];

            for (const ticket of ticketDebts) {
                const { payee, totalDebt } = ticket.dataValues;
                const user = await User.findByPk(payee);

                if (user) {
                    let debtInfo;
                    if (user.role === 'DRIVER') {
                        debtInfo = {
                            id: user.id,
                            name: user.name,
                            totalDebt: totalDebt
                        };
                        if (debtInfo) {
                            debtsDriver.push(debtInfo);
                        }
                    } else if (user.role === 'AGENT') {
                        const agent = await Agent.findOne({
                            where: { userId: payee }
                        });
                        if (agent) {
                            debtInfo = {
                                id: user.id,
                                name: agent.agentName,
                                totalDebt: totalDebt
                            };
                        }
                        if (debtInfo) {
                            debtsAgent.push(debtInfo);
                        }
                    }


                }
            }
            resolve({
                status: 200,
                message: 'Thành công!',
                data: { debtsDriver, debtsAgent }
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailDebts = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalTicketPricesAndSeats = await OrderTicket.findAll({
                attributes: [
                    'tripId',
                    [Sequelize.fn('SUM', Sequelize.col('totalPrice')), 'totalTicketPrice'],
                    [Sequelize.fn('GROUP_CONCAT', Sequelize.col('seats')), 'seatsList']
                ],
                where: {
                    payee: userId,
                    status: { [Op.notIn]: ['Canceled'] }
                },
                include: {
                    model: Trip,
                    as: 'trip',
                    attributes: ['departureDate', 'departureTime', 'routeId'],
                    include: {
                        model: Route,
                        as: 'route',
                        attributes: ['provinceStart', 'districtStart', 'provinceEnd', 'districtEnd']
                    }
                },
                group: ['tripId']
            });

            const goodsData = await OrderGoods.findAll({
                attributes: [
                    'tripId',
                    [Sequelize.fn('SUM', Sequelize.col('price')), 'totalOrderPrice'],
                ],
                where: {
                    Payee: userId,
                },
                group: ['tripId'],
            });


            const transformedData = totalTicketPricesAndSeats.map(orderTicket => {
                const { tripId, totalTicketPrice, seatsList } = orderTicket.dataValues;
                const { departureDate, departureTime, route } = orderTicket.trip;
                const { provinceStart, districtStart, provinceEnd, districtEnd } = route;

                // Tìm đơn hàng hóa tương ứng với chuyến xe
                const goods = goodsData.find(good => good.tripId === tripId);
                const totalOrderPrice = goods ? goods.dataValues.totalOrderPrice : 0;

                // Xử lý chuỗi seatsList thành mảng các chỗ ngồi
                const seatListArray = seatsList
                    .replace(/\]\,\[/g, ',') // Thay thế "],[" bằng ","
                    .replace(/^\[|\]$/g, '') // Xóa dấu "[" ở đầu và "]" ở cuối
                    .split(',') // Tách thành các phần tử
                    .map(seat => seat.replace(/\"/g, '')); // Xóa dấu ngoặc kép

                return {
                    tripId,
                    totalTicketPrice,
                    totalOrderPrice,
                    seatList: seatListArray,
                    departureDate,
                    departureTime,
                    provinceStart,
                    districtStart,
                    provinceEnd,
                    districtEnd
                };
            });

            resolve({
                status: 200,
                message: 'Thành công!',
                data: transformedData
            })
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const getRefunds = (busOwnerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const refunds = await Refund.findAll({
                where: {
                    busOwnerId: busOwnerId
                }
            })

            console.log(refunds);


            resolve({
                status: 200,
                message: 'Thành công!',
                data: refunds
            })
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const confirmRefund = (refundId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Refund.update({ isRefund: true }, {
                where: {
                    id: refundId
                }
            })
            resolve({
                status: 200,
                message: 'Thành công!',
            })
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

//AGENT

const createAgent = (newAgent) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { email, phone, password, confirmPassword, agentName, address, companyType, companyDescription, managerName, citizenId, managerPhone, managerEmail } = newAgent
            const res = await UserService.createUser({ email, phone, password, confirmPassword })
            if (res.status !== 200) {
                resolve({
                    status: 404,
                    message: res.message
                })
                return;
            }
            const createdAgent = await Agent.create({
                userId: res?.data.id,
                agentName,
                address,
                companyType,
                companyDescription,
                managerName,
                citizenId,
                managerPhone,
                managerEmail
            })

            if (createdAgent) {
                resolve({
                    status: 200,
                    message: 'Đăng ký đại lý thành công! Vui vòng chờ admin xác nhận!',
                    data: createdAgent
                })
            } else {
                await UserService.deleteUser(res?.data.id)
            }
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const getAllAgent = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const allAgent = await Agent.findAll({
                where: { isAccept: true },
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['email', 'phone']
                }],
                order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']],
            });

            resolve({
                status: 200,
                message: 'Success',
                data: allAgent
            })
        } catch (e) {
            reject(e)
        }
    })
}

const editAgent = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkAgent = await Agent.findOne({
                where: { id: id }
            });
            if (checkAgent === null) {
                resolve({
                    status: 404,
                    message: 'Đại lý không tồn tại!'
                })
                return;
            }

            await Agent.update(data, {
                where: { id: id }
            });

            resolve({
                status: 200,
                message: 'Sửa đại lý thành công!',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteAgent = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkAgent = await Agent.findOne({
                where: { id: id }
            });
            if (checkAgent === null) {
                resolve({
                    status: 404,
                    message: 'Đại lý không tồn tại!'
                })
                return;
            }

            await Agent.destroy({
                where: { id: id }
            });

            await User.destroy({
                where: { id: checkAgent.userId }
            });

            resolve({
                status: 200,
                message: 'Xóa đại lý thành công!',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailAgentByUserId = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const agent = await Agent.findOne({
                where: { userId: id }
            });
            if (agent === null) {
                resolve({
                    status: 404,
                    message: 'Đại lý không tồn tại!'
                })
                return;
            }
            resolve({
                status: 200,
                message: 'SUCESS',
                data: agent
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDebtsAgent = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const agent = await Agent.findOne({
                where: { userId: userId }
            });
            if (agent === null) {
                resolve({
                    status: 404,
                    message: 'Đại lý không tồn tại!'
                })
                return;
            }

            const orders = await OrderTicket.findAll({
                where: {
                    [Op.or]: [
                        { userOrder: userId },
                        { payee: userId }
                    ],
                    status: { [Op.notIn]: ['Canceled'] }
                },
                include: [
                    {
                        model: Trip,
                        as: 'trip',
                        include: {
                            model: BusOwner,
                            as: 'busOwner',
                            attributes: ['busOwnerName']
                        }
                    }
                ]
            });

            // Nhóm các order ticket theo busOwnerName
            const groupedData = orders.reduce((acc, order) => {
                const busOwnerName = order.trip.busOwner.busOwnerName;
                if (!acc[busOwnerName]) {
                    acc[busOwnerName] = {
                        busOwnerName,
                        ticketsSold: 0,
                        totalRevenue: 0,
                        debt: 0
                    };
                }
                acc[busOwnerName].ticketsSold += 1;
                acc[busOwnerName].totalRevenue += order.totalPrice;
                if (order.status !== 'Settled') {
                    acc[busOwnerName].debt += order.totalPrice;
                }
                return acc;
            }, {});
            const groupedDataArray = Object.values(groupedData);
            // Tính tổng số vé đã bán, tổng doanh thu và tổng dư nợ
            const totalStats = Object.values(groupedData).reduce((acc, busOperatorStats) => {
                acc.totalTicketsSold += busOperatorStats.ticketsSold;
                acc.totalRevenue += busOperatorStats.totalRevenue;
                acc.totalDebt += busOperatorStats.debt;
                return acc;
            }, {
                totalTicketsSold: 0,
                totalRevenue: 0,
                totalDebt: 0
            });



            // console.log(totalStats, groupedData);

            resolve({
                status: 200,
                message: 'SUCESS',
                data: { totalStats, groupedDataArray }
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createBusOwner,
    getAllBusOwnerNotAccept,
    getAllBusOwner,
    editBusOwner,
    deleteBusOwner,
    getDetailBusOwnerByUserId,
    getOverviewBusOwner,
    getStatisticBusOwner,
    getDebtsBusOwner,
    getDetailDebts,
    getRefunds,
    confirmRefund,

    createAgent,
    getAllAgent,
    editAgent,
    deleteAgent,
    getDetailAgentByUserId,
    getDebtsAgent

}