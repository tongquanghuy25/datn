const { User, Trip, Refund, OrderTicket, OrderGoods } = require("../models/index")
const EmailService = require("../services/EmailService")
// const sequelize = require('sequelize');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

const { generateQRCode } = require("./QrCodeService");
const { generateRandomCode } = require("../utils");

const createTicketOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {

        const transaction = await sequelize.transaction();
        try {
            // Kiểm tra số lượng ghế trống trong chuyến đi

            const { tripId, userOrder, name, email, phone, departureTime, departureDate, pickUp, notePickUp, timePickUp, datePickUp, dropOff, noteDropOff, timeDropOff, dateDropOff,
                seats, seatCount, ticketPrice, extraCosts, discount, totalPrice, payee, paymentMethod, paidAt, isPaid } = newOrder

            const trip = await Trip.findOne({
                where: {
                    id: tripId,
                },
                transaction,
                raw: true
            });

            if (!trip || (trip.bookedSeats + seatCount > trip.totalSeats)) {
                await transaction.rollback();
                resolve({
                    status: 400,
                    message: 'Số chỗ trống không đủ!'
                });
                return;
            }

            const newBookedSeats = trip.bookedSeats + seatCount

            await Trip.update(
                { bookedSeats: newBookedSeats },
                { where: { id: tripId }, transaction }
            );

            // Kiểm tra các ghế đã được đặt hay chưa
            const allSeats = await OrderTicket.findAll({
                attributes: ['seats'],
                where: { tripId: tripId },
                transaction,
                raw: true
            })
            const listseat = allSeats.map(item => JSON.parse(item.seats)).flat()
            const isDuplicate = seats.some(seat => listseat.includes(seat));
            if (isDuplicate) {
                await transaction.rollback();
                resolve({
                    status: 400,
                    message: 'Một số ghế đã được đặt bởi người khác!'
                })
                return
            }

            let code = ''
            while (code === '') {
                let cod = generateRandomCode(8);
                const check = await OrderTicket.findOne({
                    where: {
                        code: cod
                    }
                });
                if (check === null) {
                    code = cod
                }
            }

            // console.log('tripId', tripId)
            // console.log('userOrder', userOrder)
            // console.log('name', name)
            // console.log('email', email)
            // console.log('phone', phone)
            // console.log('departureTime', departureTime)
            // console.log('departureDate', departureDate)
            // console.log('code', code)
            // console.log('pickUp', pickUp)
            // console.log('notePickUp', notePickUp)
            // console.log('timePickUp', timePickUp)
            // console.log('datePickUp', datePickUp)
            // console.log('dropOff', dropOff)
            // console.log('noteDropOff', noteDropOff)
            // console.log('timeDropOff', timeDropOff)
            // console.log('dateDropOff', dateDropOff)
            // console.log('seats', seats)
            // console.log('seatCount', seatCount)
            // console.log('ticketPrice', ticketPrice)
            // console.log('extraCosts', extraCosts)
            // console.log('discount', discount)
            // console.log('totalPrice', totalPrice)
            // console.log('payee', payee)
            // console.log('paymentMethod', paymentMethod)
            // console.log('isPaid', isPaid)
            // console.log('paidAt', paidAt)

            const createdOrder = await OrderTicket.create(
                {
                    tripId,
                    userOrder,
                    name,
                    email,
                    phone,
                    departureTime,
                    departureDate,
                    code,

                    pickUp,
                    notePickUp,
                    timePickUp,
                    datePickUp,
                    dropOff,
                    noteDropOff,
                    timeDropOff,
                    dateDropOff,

                    seats,
                    seatCount,

                    ticketPrice,
                    extraCosts,
                    discount,
                    totalPrice,

                    payee,
                    paymentMethod,
                    isPaid,
                    paidAt
                },
                { transaction }
            );

            await transaction.commit();

            if (createdOrder) {
                // await EmailService.sendEmailCreateOrder(createdOrder)
                console.log('createdOrder', createdOrder);
                // await EmailService.sendEmailCreateOrder()
                resolve({
                    status: 200,
                    message: 'Tạo đơn đặt vé thành công!',
                    data: createdOrder
                })
            }

        } catch (e) {
            console.log(e);
            await transaction.rollback();
            reject(e)
        }
    })
}

const getSeatsBookedByTrip = (tripId) => {
    return new Promise(async (resolve, reject) => {
        try {

            const trip = await Trip.findByPk(tripId);
            if (trip === null) {
                resolve({
                    status: 404,
                    message: 'Không tìm thấy chuyến xe!'
                })
            }

            const allSeats = await OrderTicket.findAll({
                attributes: ['seats'],
                where: { tripId: tripId },
                raw: true
            })
            resolve({
                status: 200,
                message: 'SUCESSS',
                data: allSeats.map(item => JSON.parse(item.seats)).flat()
            })
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const getTicketsByUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findByPk(userId);
            if (user === null) {
                resolve({
                    status: 404,
                    message: 'Không tìm thấy người dùng!'
                })
            }
            const allTicket = await OrderTicket.findAll({
                where: { userOrder: userId },
                include: { model: Trip, as: 'trip' },
                order: [['createdAt', 'DESC']]
            });

            resolve({
                status: 200,
                message: 'SUCESSS',
                data: allTicket
            })
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const getTicketById = (ticketId, phone) => {
    return new Promise(async (resolve, reject) => {
        try {

            const ticket = await OrderTicket.findOne({
                where: { id: ticketId, phone: phone }
            });
            if (ticket === null) {
                resolve({
                    status: 404,
                    message: 'Vé không tồn tại!'
                })
            }
            resolve({
                status: 200,
                message: 'SUCESSS',
                data: ticket
            })
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const getTicketOrderByTrip = (tripId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const trip = await Trip.findByPk(tripId);
            if (trip === null) {
                resolve({
                    status: 404,
                    message: 'Không tìm thấy chuyến xe!'
                })
            }

            const orders = await OrderTicket.findAll({
                where: { tripId: tripId }
            });
            resolve({
                status: 200,
                message: 'SUCESSS',
                data: orders
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteTicketOrder = (ticketOrederId, busOwnerId, isOnTimeAllow, isPaid) => {
    return new Promise(async (resolve, reject) => {
        try {
            const orderTicket = await OrderTicket.findByPk(ticketOrederId);
            if (!orderTicket) {
                resolve({
                    status: 400,
                    message: 'Đơn gửi hàng không tồn tại!'
                })
                return
            }
            const deleteOrder = await OrderTicket.destroy({
                where: { id: ticketOrederId }
            });

            if (deleteOrder) {
                if (isPaid === 'true') {
                    let refundAmount = 0
                    if (isOnTimeAllow === 'true') {
                        refundAmount = orderTicket.totalPrice
                    } else refundAmount = orderTicket.totalPrice / 2

                    await Refund.create({ busOwnerId: busOwnerId, name: orderTicket?.name, email: orderTicket?.email, phone: orderTicket?.phone, refundAmount: refundAmount })

                }
                await Trip.update(
                    {
                        availableSeats: sequelize.literal(`availableSeats + ${orderTicket.seatCount}`)
                    },
                    {
                        where: {
                            id: orderTicket.tripId
                        }
                    }
                );

                resolve({
                    status: 200,
                    message: 'Xóa đơn gửi hàng thành công!',
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

const changeSeat = (ticketOrderId, tripId, seats, seatSwap, destinationSeat) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra các ghế đã được đặt hay chưa
            const allSeats = await OrderTicket.findAll({
                attributes: ['seats'],
                where: { tripId: tripId },
                raw: true
            })
            const listseat = allSeats.map(item => JSON.parse(item.seats)).flat()
            const isDuplicate = listseat.includes(destinationSeat);
            if (isDuplicate) {
                resolve({
                    status: 400,
                    message: 'Một số ghế đã được đặt bởi người khác!'
                })
                return
            }

            let newSeats = []
            const seatIndex = JSON.parse(seats).indexOf(seatSwap);
            console.log(seats, seatIndex, seatSwap, destinationSeat);
            if (seatIndex !== -1) {
                newSeats = JSON.parse(seats);
                newSeats.splice(seatIndex, 1)
                newSeats.push(destinationSeat);
            }

            const ticketOrder = await OrderTicket.update({ seats: newSeats }, { where: { id: ticketOrderId } });
            if (ticketOrder === null) {
                resolve({
                    status: 404,
                    message: 'Đơn vé không tồn tại!'
                })
                return
            }
            resolve({
                status: 200,
                message: 'Cập nhật trạng thái đơn vé thành công!',
            })
        } catch (e) {
            console.log('e', e);
            reject(e)
        }
    })
}

const deleteSeat = (ticketOrder, seatDelete, busOwnerId, isOnTimeAllow) => {
    return new Promise(async (resolve, reject) => {
        try {

            const seats = JSON.parse(ticketOrder.seats)
            const seatIndex = seats.indexOf(seatDelete);
            if (seatIndex !== -1) {
                seats.splice(seatIndex, 1);
            }

            if (ticketOrder?.isPaid) {
                if (seats.length > 0) {
                    let refundAmount = 0
                    if (isOnTimeAllow) refundAmount = ticketOrder?.ticketPrice
                    else refundAmount = ticketOrder?.ticketPrice / 2
                    await OrderTicket.update({ seats: seats, seatCount: seats.length }, { where: { id: ticketOrder.id } });
                    await Refund.create({ busOwnerId: busOwnerId, name: ticketOrder?.name, email: ticketOrder?.email, phone: ticketOrder?.phone, refundAmount: refundAmount })
                } else {
                    let refundAmount = 0
                    if (isOnTimeAllow) refundAmount = ticketOrder?.totalPrice
                    else refundAmount = ticketOrder?.totalPrice / 2
                    await OrderTicket.destroy({ where: { id: ticketOrder.id } });
                    await Refund.create({ busOwnerId: busOwnerId, name: ticketOrder?.name, email: ticketOrder?.email, phone: ticketOrder?.phone, refundAmount: ticketOrder?.totalPrice })
                }
            } else {
                if (seats.length > 0) {
                    const totalPrice = ticketOrder.totalPrice - ticketOrder.ticketPrice
                    await OrderTicket.update(
                        { seats: seats, totalPrice: totalPrice, seatCount: seats.length },
                        { where: { id: ticketOrder.id } }
                    );
                } else await OrderTicket.destroy({ where: { id: ticketOrder.id } });

            }

            await Trip.update(
                { availableSeats: sequelize.literal('bookedSeats + 1') },
                { where: { id: ticketOrder.tripId } }
            );

            resolve({
                status: 200,
                message: 'Cập nhật trạng thái đơn vé thành công!',
            })

        } catch (e) {
            console.log('e', e);
            reject(e)
        }
    })
}

const updateTicketOrder = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updated = await OrderTicket.update(data, { where: { id } });
            if (updated === null) {
                resolve({
                    status: 404,
                    message: 'Đơn vé không tồn tại!'
                })
                return
            }
            else {
                const ticketOrder = await OrderTicket.findByPk(id);
                resolve({
                    status: 200,
                    message: 'Cập nhật đơn vé thành công!',
                    data: ticketOrder
                })
            }

        } catch (e) {
            console.log('e', e);
            reject(e)
        }
    })
}

//GOODS
const createGoodsOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { tripId, departureDate, nameSender, emailSender, phoneSender, nameReceiver, emailReceiver, phoneReceiver, sendPlace, noteSend, timeSend, dateSend, receivePlace,
                noteReceive, timeReceive, dateReceive, goodsName, goodsDescription, price, Payee, paymentMethod, isPaid } = newOrder

            const trip = await Trip.findByPk(tripId);
            if (!trip) {
                resolve({
                    status: 400,
                    message: 'Chuyến đi không tồn tại!'
                })
                return
            }

            const code = ''
            while (code !== '') {
                let cod = generateRandomCode(8);
                const check = await OrderGoods.findOne({
                    where: {
                        code: cod
                    }
                });
                if (check === null) {
                    code = cod
                }
            }

            const createdOrder = await OrderGoods.create(
                {
                    tripId,
                    departureDate,
                    code,

                    nameSender,
                    emailSender,
                    phoneSender,
                    nameReceiver,
                    emailReceiver,
                    phoneReceiver,

                    sendPlace,
                    noteSend,
                    timeSend,
                    dateSend,
                    receivePlace,
                    noteReceive,
                    timeReceive,
                    dateReceive,

                    goodsName,
                    goodsDescription,
                    price,

                    Payee,
                    paymentMethod,
                    isPaid
                }
            );

            if (createdOrder) {
                resolve({
                    status: 200,
                    message: 'Tạo đơn đặt vé thành công!',
                    data: createdOrder
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

const updateGoodsOrder = (Order) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { goodsOrederId, nameSender, emailSender, phoneSender, nameReceiver, emailReceiver, phoneReceiver, sendPlace, noteSend, timeSend, dateSend, receivePlace,
                noteReceive, timeReceive, dateReceive, goodsName, goodsDescription, price, Payee, paymentMethod, isPaid, status } = Order

            const orderGoods = await OrderGoods.findByPk(goodsOrederId);
            if (!orderGoods) {
                resolve({
                    status: 400,
                    message: 'Đơn gửi hàng không tồn tại!'
                })
                return
            }

            const updateOrder = await OrderGoods.update({
                nameSender,
                emailSender,
                phoneSender,
                nameReceiver,
                emailReceiver,
                phoneReceiver,

                sendPlace,
                noteSend,
                timeSend,
                dateSend,
                receivePlace,
                noteReceive,
                timeReceive,
                dateReceive,

                goodsName,
                goodsDescription,
                price,

                Payee,
                paymentMethod,
                isPaid,
                status
            }, { where: { id: goodsOrederId } });


            if (updateOrder) {
                resolve({
                    status: 200,
                    message: 'Cập nhật đơn gửi hàng thành công!',
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

const deleteGoodsOrder = (goodsOrederId, busOwnerId) => {
    return new Promise(async (resolve, reject) => {
        try {

            const orderGoods = await OrderGoods.findByPk(goodsOrederId);
            if (!orderGoods) {
                resolve({
                    status: 400,
                    message: 'Đơn gửi hàng không tồn tại!'
                })
                return
            }

            const deleteOrder = await OrderGoods.destroy({ where: { id: goodsOrederId } });

            if (deleteOrder) {
                resolve({
                    status: 200,
                    message: 'Xóa đơn gửi hàng thành công!',
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

const getGoodsOrderByTrip = (tripId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const trip = await Trip.findByPk(tripId);
            if (trip === null) {
                resolve({
                    status: 404,
                    message: 'Không tìm thấy chuyến xe!'
                })
            }
            const allGoodsOrder = await OrderGoods.findAll({
                where: { tripId: tripId },
                order: [['createdAt', 'ASC'], ['updatedAt', 'ASC']]
            });

            resolve({
                status: 200,
                message: 'SUCESSS',
                data: allGoodsOrder
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updateStatusGoodsOrder = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updated = await OrderGoods.update(data, {
                where: { id },
            });
            if (!updated) {
                resolve({
                    status: 404,
                    message: 'Đơn gửi hàng không tồn tại!'
                })
                return
            }
            const goodsOrder = await OrderGoods.findByPk(id)
            resolve({
                status: 200,
                message: 'Cập nhật trạng thái đơn vé thành công!',
                data: goodsOrder
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createTicketOrder,
    getTicketOrderByTrip,
    getSeatsBookedByTrip,
    getTicketsByUser,
    getTicketById,
    updateTicketOrder,
    changeSeat,
    deleteSeat,

    createGoodsOrder,
    updateGoodsOrder,
    deleteGoodsOrder,
    getGoodsOrderByTrip,
    updateStatusGoodsOrder,
    deleteTicketOrder,

}