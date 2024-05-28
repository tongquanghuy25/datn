const OrderService = require('../services/OrderService')
const { checkTransactionStatus, cancelTransaction } = require('../utils')

const createTicketOrder = async (req, res) => {
    try {
        const { tripId, userOrder, name, email, phone, departureTime, departureDate, pickUp, notePickUp, timePickUp, datePickUp, dropOff, noteDropOff, timeDropOff, dateDropOff,
            seats, seatCount, ticketPrice, extraCosts, discount, totalPrice, payee, paymentMethod, transactionId, paidAt, isPaid } = req.body


        if (!tripId || !departureTime || !name || !email || !phone || !departureDate || !pickUp || !timePickUp || !datePickUp || !dropOff || !timeDropOff || !dateDropOff
            || !seatCount || !ticketPrice || !totalPrice
        ) {
            return res.status(400).json({
                message: 'Thông tin nhập vào chưa đủ !'
            })
        }

        if (paymentMethod === 'paypal' && paidAt && isPaid) {
            if (await checkTransactionStatus(transactionId) !== true) {
                return res.status(400).json({
                    message: 'Lỗi xác thực giao dịch paypal!'
                })
            }
        }
        const response = await OrderService.createTicketOrder({
            tripId, userOrder, name, email, phone, departureTime, departureDate, pickUp, notePickUp, timePickUp, datePickUp, dropOff, noteDropOff, timeDropOff, dateDropOff,
            seats, seatCount, ticketPrice, extraCosts, discount, totalPrice, payee, paymentMethod, paidAt, isPaid
        })
        // if (response.status !== 200) cancelTransaction(transactionId)
        return res.status(response.status).json(response)

    } catch (e) {
        console.log(e);
        // cancelTransaction(req.body.transactionId)
        return res.status(404).json({
            message: e
        })
    }
}

const getSeatsBookedByTrip = async (req, res) => {
    try {
        const tripId = req.params.id
        if (!tripId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Id chuyến xe không được bỏ trống!'
            })
        }
        const response = await OrderService.getSeatsBookedByTrip(tripId)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getTicketsByUser = async (req, res) => {
    try {
        const useId = req.params.id
        if (!useId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Id người dùng không được bỏ trống!'
            })
        }
        const response = await OrderService.getTicketsByUser(useId)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getTicketById = async (req, res) => {
    try {
        const ticketId = req.query.ticketId
        const phone = req.query.phone
        if (!ticketId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Id vé không được bỏ trống!'
            })
        }
        if (!phone) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Số điện thoại không được bỏ trống!'
            })
        }
        const response = await OrderService.getTicketById(ticketId, phone)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteTicketOrder = async (req, res) => {
    try {
        const { isOnTimeAllow, isPaid } = req.query.data
        const ticketOrederId = req.params.id

        if (!ticketOrederId) {
            return res.status(400).json({
                message: 'Thông tin nhập vào chưa đủ !'
            })
        }


        const response = await OrderService.deleteTicketOrder(ticketOrederId, isOnTimeAllow, isPaid)

        return res.status(response.status).json(response)

    } catch (e) {
        console.log(e);
        return res.status(404).json({
            message: e
        })
    }
}

const changeSeat = async (req, res) => {
    try {
        const { tripId, seats, seatSwap, destinationSeat } = req.body
        const ticketOrderId = req.params.id
        if (!ticketOrderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Id của đơn vé bị trống!'
            })
        }
        const response = await OrderService.changeSeat(ticketOrderId, tripId, seats, seatSwap, destinationSeat)
        return res.status(response.status).json(response)
    } catch (e) {
        console.log('e', e);
        return res.status(404).json({
            message: e
        })
    }
}

const deleteSeat = async (req, res) => {
    try {
        const { ticketOrder, seatDelete, isOnTimeAllow } = req.body
        if (!ticketOrder) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Đơn vé bị trống!'
            })
        }
        const response = await OrderService.deleteSeat(ticketOrder, seatDelete, isOnTimeAllow)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateTicketOrder = async (req, res) => {
    try {
        const { name, email, phone, pickUp, notePickUp, timePickUp, datePickUp, dropOff, noteDropOff, timeDropOff, dateDropOff,
            seats, ticketPrice, extraCosts, discount, totalPrice, payee, paidAt, isPaid, paymentMethod, status } = req.body

        const ticketOrderId = req.params.id
        if (!ticketOrderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Id của đơn vé bị trống!'
            })
        }
        const response = await OrderService.updateTicketOrder(ticketOrderId,
            {
                name, email, phone, pickUp, notePickUp, timePickUp, datePickUp, dropOff, noteDropOff, timeDropOff, dateDropOff,
                seats, ticketPrice, extraCosts, discount, totalPrice, payee, paidAt, isPaid, paymentMethod, status
            }
        )
        return res.status(response.status).json(response)
    } catch (e) {
        console.log('e', e);
        return res.status(404).json({
            message: e
        })
    }
}

const getTicketOrderByTrip = async (req, res) => {
    try {
        const tripId = req.params.id
        if (!tripId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Id chuyến xe không được bỏ trống!'
            })
        }
        const response = await OrderService.getTicketOrderByTrip(tripId)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

//
const getDetailsOrder = async (req, res) => {
    try {
        const orderId = req.params.id
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await OrderService.getOrderDetails(orderId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const cancelOrderDetails = async (req, res) => {
    try {
        const data = req.body.orderItems
        const orderId = req.body.orderId
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId is required'
            })
        }
        const response = await OrderService.cancelOrderDetails(orderId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllOrder = async (req, res) => {
    try {
        const data = await OrderService.getAllOrder()
        return res.status(200).json(data)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

// GOODS
const createGoodsOrder = async (req, res) => {
    try {
        const { tripId, departureDate, nameSender, emailSender, phoneSender, nameReceiver, emailReceiver, phoneReceiver, sendPlace, noteSend, timeSend, dateSend, receivePlace,
            noteReceive, timeReceive, dateReceive, goodsName, goodsDescription, price, Payee, paymentMethod, isPaid } = req.body


        if (!tripId || !departureDate || !nameSender || !emailSender || !phoneSender || !nameReceiver || !emailReceiver || !phoneReceiver || !sendPlace || !timeSend || !dateSend || !receivePlace
            || !timeReceive || !dateReceive || !goodsName || !goodsDescription || !price
        ) {
            return res.status(400).json({
                message: 'Thông tin nhập vào chưa đủ !'
            })
        }


        const response = await OrderService.createGoodsOrder({
            tripId, departureDate, nameSender, emailSender, phoneSender, nameReceiver, emailReceiver, phoneReceiver, sendPlace, noteSend, timeSend, dateSend, receivePlace,
            noteReceive, timeReceive, dateReceive, goodsName, goodsDescription, price, Payee, paymentMethod, isPaid
        })

        return res.status(response.status).json(response)

    } catch (e) {
        console.log(e);
        return res.status(404).json({
            message: e
        })
    }
}

const updateGoodsOrder = async (req, res) => {
    try {
        const goodsOrederId = req.params.id
        const { nameSender, emailSender, phoneSender, nameReceiver, emailReceiver, phoneReceiver, sendPlace, noteSend, timeSend, dateSend, receivePlace,
            noteReceive, timeReceive, dateReceive, goodsName, goodsDescription, price, Payee, paymentMethod, isPaid } = req.body


        if (!goodsOrederId || !nameSender || !emailSender || !phoneSender || !nameReceiver || !emailReceiver || !phoneReceiver || !sendPlace || !timeSend || !dateSend || !receivePlace
            || !timeReceive || !dateReceive || !goodsName || !goodsDescription || !price
        ) {
            return res.status(400).json({
                message: 'Thông tin nhập vào chưa đủ !'
            })
        }


        const response = await OrderService.updateGoodsOrder({
            goodsOrederId, nameSender, emailSender, phoneSender, nameReceiver, emailReceiver, phoneReceiver, sendPlace, noteSend, timeSend, dateSend, receivePlace,
            noteReceive, timeReceive, dateReceive, goodsName, goodsDescription, price, Payee, paymentMethod, isPaid
        })

        return res.status(response.status).json(response)

    } catch (e) {
        console.log(e);
        return res.status(404).json({
            message: e
        })
    }
}

const deleteGoodsOrder = async (req, res) => {
    try {
        const goodsOrederId = req.params.id


        if (!goodsOrederId) {
            return res.status(400).json({
                message: 'Thông tin nhập vào chưa đủ !'
            })
        }


        const response = await OrderService.deleteGoodsOrder(goodsOrederId)

        return res.status(response.status).json(response)

    } catch (e) {
        console.log(e);
        return res.status(404).json({
            message: e
        })
    }
}

const getGoodsOrderByTrip = async (req, res) => {
    try {
        const tripId = req.params.id
        if (!tripId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Id chuyến xe không được bỏ trống!'
            })
        }
        const response = await OrderService.getGoodsOrderByTrip(tripId)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateStatusGoodsOrder = async (req, res) => {
    try {
        const { status, isPaid } = req.body
        const goodsOrderId = req.params.id
        if (!goodsOrderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Id của đơn gửi hàng bị trống!'
            })
        }
        const response = await OrderService.updateStatusGoodsOrder(goodsOrderId, { status, isPaid })
        return res.status(response.status).json(response)
    } catch (e) {
        console.log('e', e);
        return res.status(404).json({
            message: e
        })
    }
}
module.exports = {
    createTicketOrder,
    getTicketOrderByTrip,
    getTicketsByUser,
    getTicketById,
    createGoodsOrder,
    updateGoodsOrder,
    deleteGoodsOrder,
    getGoodsOrderByTrip,
    updateStatusGoodsOrder,
    updateTicketOrder,
    changeSeat,
    deleteSeat,
    getSeatsBookedByTrip,
    deleteTicketOrder,

    getDetailsOrder,
    cancelOrderDetails,
    getAllOrder
}
