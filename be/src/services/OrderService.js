const OrderTicket = require("../models/OrderTicketModel")
const OrderGoods = require("../models/OrderGoodsMode;")
const User = require("../models/UserModel")
const Trip = require("../models/TripModel")
const Refund = require("../models/RefundModel")
const EmailService = require("../services/EmailService")

const mongoose = require('mongoose');
const { generateQRCode } = require("./QrCodeService");

// Import các module và class từ Mongoose
const { startSession } = mongoose;

const createTicketOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {

        const session = await startSession();
        session.startTransaction();
        try {
            // Kiểm tra số lượng ghế trống trong chuyến đi

            const { tripId, userOrder, name, email, phone, departureTime, departureDate, pickUp, notePickUp, timePickUp, datePickUp, dropOff, noteDropOff, timeDropOff, dateDropOff,
                seats, seatCount, ticketPrice, extraCosts, discount, totalPrice, payee, paymentMethod, paidAt, isPaid } = newOrder

            const trip = await Trip.findOneAndUpdate(
                {
                    _id: tripId,
                    availableSeats: { $gte: seatCount }
                },
                {
                    $inc: {
                        availableSeats: -seatCount
                    }

                },
                { new: true, session }
            );

            if (!trip) {
                await session.abortTransaction();
                session.endSession();

                resolve({
                    status: 400,
                    message: 'Số chỗ trống không đủ!'
                })
                return
            }

            // Kiểm tra các ghế đã được đặt hay chưa
            const existingOrders = await OrderTicket.find({ tripId, seats: { $in: seats } });
            if (existingOrders.length > 0) {
                await session.abortTransaction();
                session.endSession();
                resolve({
                    status: 400,
                    message: 'Một số ghế đã được đặt bởi người khác!'
                })
                return
            }


            const createdOrder = await OrderTicket.create(
                {
                    tripId,
                    userOrder,
                    name,
                    email,
                    phone,
                    departureTime,
                    departureDate,

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
                }
            );
            await session.commitTransaction();
            session.endSession();

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
            await session.abortTransaction();
            session.endSession();
            reject(e)
        }
    })
}

const getSeatsBookedByTrip = (tripId) => {
    return new Promise(async (resolve, reject) => {
        try {

            const trip = await Trip.findById(tripId)
            if (trip === null) {
                resolve({
                    status: 404,
                    message: 'Không tìm thấy chuyến xe!'
                })
            }
            const allSeats = await OrderTicket.distinct('seats', { tripId: tripId });

            resolve({
                status: 200,
                message: 'SUCESSS',
                data: allSeats
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getTicketsByUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findById(userId)
            if (user === null) {
                resolve({
                    status: 404,
                    message: 'Không tìm thấy người dùng!'
                })
            }
            const allTicket = await OrderTicket.find({ userOrder: userId }).populate('tripId').sort({ createdAt: -1 })

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
            const ticket = await OrderTicket.find({ _id: ticketId, phone: phone })
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

            const trip = await Trip.findById(tripId)
            if (trip === null) {
                resolve({
                    status: 404,
                    message: 'Không tìm thấy chuyến xe!'
                })
            }
            const orders = await OrderTicket.find({ tripId: tripId });

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

const deleteTicketOrder = (ticketOrederId, isOnTimeAllow, isPaid) => {
    return new Promise(async (resolve, reject) => {
        try {

            const orderTicket = await OrderTicket.findById(ticketOrederId);

            if (!orderTicket) {
                resolve({
                    status: 400,
                    message: 'Đơn gửi hàng không tồn tại!'
                })
                return
            }


            const deleteOrder = await OrderTicket.findByIdAndDelete(ticketOrederId);


            if (deleteOrder) {
                if (isPaid === 'true') {
                    let refundAmount = 0
                    if (isOnTimeAllow === 'true') {
                        refundAmount = deleteOrder.totalPrice
                    } else refundAmount = deleteOrder.totalPrice / 2

                    await Refund.create({ name: deleteOrder?.name, email: deleteOrder?.email, phone: deleteOrder?.phone, refundAmount: refundAmount })

                }
                await Trip.findByIdAndUpdate(deleteOrder.tripId._id,
                    {
                        $inc: {
                            availableSeats: deleteOrder.seatCount
                        }

                    }

                )

                resolve({
                    status: 200,
                    message: 'Xóa đơn gửi hàng thành công!',
                    data: deleteOrder
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
            const existingOrders = await OrderTicket.find({ tripId, seats: { $elemMatch: { $eq: destinationSeat } } });
            if (existingOrders.length > 0) {
                resolve({
                    status: 400,
                    message: 'Ghế trống đã được đặt bởi người khác!'
                })
                return
            }

            const seatIndex = seats.indexOf(seatSwap);
            if (seatIndex !== -1) {
                seats.splice(seatIndex, 1);
                seats.push(destinationSeat);
            }

            console.log(seats);
            const ticketOrder = await OrderTicket.findByIdAndUpdate(ticketOrderId, { seats: seats }, { new: true })
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
                data: ticketOrder
            })
        } catch (e) {
            console.log('e', e);
            reject(e)
        }
    })
}

const deleteSeat = (ticketOrder, seatDelete, isOnTimeAllow) => {
    return new Promise(async (resolve, reject) => {
        try {

            const seats = ticketOrder.seats
            const seatIndex = seats.indexOf(seatDelete);
            if (seatIndex !== -1) {
                seats.splice(seatIndex, 1);
            }

            let ticket

            if (ticketOrder?.isPaid) {
                if (seats.length > 0) {
                    let refundAmount = 0
                    if (isOnTimeAllow) refundAmount = ticketOrder?.ticketPrice
                    else refundAmount = ticketOrder?.ticketPrice / 2
                    ticket = await OrderTicket.findByIdAndUpdate(ticketOrder._id, { seats: seats, seatCount: seats.length }, { new: true })
                    await Refund.create({ name: ticketOrder?.name, email: ticketOrder?.email, phone: ticketOrder?.phone, refundAmount: refundAmount })
                } else {
                    let refundAmount = 0
                    if (isOnTimeAllow) refundAmount = ticketOrder?.totalPrice
                    else refundAmount = ticketOrder?.totalPrice / 2
                    ticket = await OrderTicket.findByIdAndDelete(ticketOrder._id)
                    await Refund.create({ name: ticketOrder?.name, email: ticketOrder?.email, phone: ticketOrder?.phone, refundAmount: ticketOrder?.totalPrice })
                }
            } else {
                if (seats.length > 0) {
                    const totalPrice = ticketOrder.totalPrice - ticketOrder.ticketPrice
                    ticket = await OrderTicket.findByIdAndUpdate(ticketOrder._id, { seats: seats, totalPrice: totalPrice, seatCount: seats.length }, { new: true })
                } else ticket = await OrderTicket.findByIdAndDelete(ticketOrder._id)
            }

            const trip = await Trip.findByIdAndUpdate(ticketOrder.tripId,
                {
                    $inc: {
                        availableSeats: 1
                    }

                },

                {
                    new: true
                }
            )
            resolve({
                status: 200,
                message: 'Cập nhật trạng thái đơn vé thành công!',
                data: ticket
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
            const ticketOrder = await OrderTicket.findByIdAndUpdate(id, data, { new: true })
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
                data: ticketOrder
            })
        } catch (e) {
            console.log('e', e);
            reject(e)
        }
    })
}

const getTicketOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await OrderTicket.findById({
                _id: id
            })
            if (order === null) {
                resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

const cancelTicketOrderDetails = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let order = []
            const promises = data.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        selled: { $gte: order.amount }
                    },
                    {
                        $inc: {
                            countInStock: +order.amount,
                            selled: -order.amount
                        }
                    },
                    { new: true }
                )
                if (productData) {
                    order = await OrderTicket.findByIdAndDelete(id)
                    if (order === null) {
                        resolve({
                            status: 'ERR',
                            message: 'The order is not defined'
                        })
                    }
                } else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results[0] && results[0].id

            if (newData) {
                resolve({
                    status: 'ERR',
                    message: `San pham voi id: ${newData} khong ton tai`
                })
            }
            resolve({
                status: 'OK',
                message: 'success',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllTicketOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await OrderTicket.find().sort({ createdAt: -1, updatedAt: -1 })
            resolve({
                status: 'OK',
                message: 'Success',
                data: allOrder
            })
        } catch (e) {
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

            const trip = await Trip.findById(tripId);

            if (!trip) {
                resolve({
                    status: 400,
                    message: 'Chuyến đi không tồn tại!'
                })
                return
            }

            // Kiểm tra các ghế đã được đặt hay chưa

            const createdOrder = await OrderGoods.create(
                {
                    tripId,
                    departureDate,

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

            console.log(createdOrder);
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

            const orderGoods = await OrderGoods.findById(goodsOrederId);

            if (!orderGoods) {
                resolve({
                    status: 400,
                    message: 'Đơn gửi hàng không tồn tại!'
                })
                return
            }

            // Kiểm tra các ghế đã được đặt hay chưa

            const updateOrder = await OrderGoods.findByIdAndUpdate(goodsOrederId, {
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
            });

            if (updateOrder) {
                resolve({
                    status: 200,
                    message: 'Cập nhật đơn gửi hàng thành công!',
                    data: updateOrder
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

const deleteGoodsOrder = (goodsOrederId) => {
    return new Promise(async (resolve, reject) => {
        try {


            const orderGoods = await OrderGoods.findById(goodsOrederId);

            if (!orderGoods) {
                resolve({
                    status: 400,
                    message: 'Đơn gửi hàng không tồn tại!'
                })
                return
            }

            // Kiểm tra các ghế đã được đặt hay chưa

            // await OrderGoods.updateMany({}, { tripId: '6631f6867b09020fcdd9815d' })
            // resolve({
            //     status: 200,
            //     message: 'Xóa đơn gửi hàng thành công!',
            // })
            const deleteOrder = await OrderGoods.findByIdAndDelete(goodsOrederId);

            if (deleteOrder) {
                resolve({
                    status: 200,
                    message: 'Xóa đơn gửi hàng thành công!',
                    data: deleteOrder
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

            const trip = await Trip.findById(tripId)
            if (trip === null) {
                resolve({
                    status: 404,
                    message: 'Không tìm thấy chuyến xe!'
                })
            }
            const allGoodsOrder = await OrderGoods.find({ tripId: tripId }).sort({ createdAt: 1, updatedAt: 1 });

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
            const goodsOrder = await OrderGoods.findByIdAndUpdate(id, data, { new: true })
            if (goodsOrder === null) {
                resolve({
                    status: 404,
                    message: 'Đơn gửi hàng không tồn tại!'
                })
                return
            }
            resolve({
                status: 200,
                message: 'Cập nhật trạng thái đơn vé thành công!',
                data: goodsOrder
            })
        } catch (e) {
            console.log('e', e);
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

    getTicketOrderDetails,
    cancelTicketOrderDetails,
    getAllTicketOrder
}