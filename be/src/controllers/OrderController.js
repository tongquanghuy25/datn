const OrderService = require('../services/OrderService')
const { checkTransactionStatus, cancelTransaction } = require('../utils')

const createTicketOrder = async (req, res) => {
    try {
        const { tripId, email, phone, busOwnerName, routeName, departureTime, departureDate, pickUp, notePickUp, timePickUp, datePickUp, dropOff, noteDropOff, timeDropOff, dateDropOff,
            seats, seatCount, ticketPrice, extraCosts, discount, totalPrice, payer, paymentMethod, transactionId, paidAt, isPaid } = req.body

        if (!tripId || !busOwnerName || !routeName || !departureTime || !email || !phone || !departureDate || !pickUp || !timePickUp || !datePickUp || !dropOff || !timeDropOff || !dateDropOff
            || !seats || !seatCount || !ticketPrice || !totalPrice || !payer || !paymentMethod
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
            tripId, email, phone, busOwnerName, routeName, departureTime, departureDate, pickUp, notePickUp, timePickUp, datePickUp, dropOff, noteDropOff, timeDropOff, dateDropOff,
            seats, seatCount, ticketPrice, extraCosts, discount, totalPrice, payer, paymentMethod, paidAt, isPaid
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

const updateStatusTicketOrder = async (req, res) => {
    try {
        const status = req.body.status
        const ticketOrderId = req.params.id
        console.log(status, ticketOrderId);
        if (!ticketOrderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Id của đơn vé bị trống!'
            })
        }
        const response = await OrderService.updateStatusTicketOrder(ticketOrderId, status)
        return res.status(response.status).json(response)
    } catch (e) {
        console.log('e', e);
        return res.status(404).json({
            message: e
        })
    }
}

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
        const status = req.body.status
        const goodsOrderId = req.params.id
        if (!goodsOrderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Id của đơn gửi hàng bị trống!'
            })
        }
        const response = await OrderService.updateStatusGoodsOrder(goodsOrderId, status)
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
    createGoodsOrder,
    updateGoodsOrder,
    deleteGoodsOrder,
    getGoodsOrderByTrip,
    updateStatusGoodsOrder,

    getSeatsBookedByTrip,
    updateStatusTicketOrder,
    getDetailsOrder,
    cancelOrderDetails,
    getAllOrder
}
