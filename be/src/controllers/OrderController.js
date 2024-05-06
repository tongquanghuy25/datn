const OrderService = require('../services/OrderService')
const { checkTransactionStatus, cancelTransaction } = require('../utils')

const createOrder = async (req, res) => {
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

        const response = await OrderService.createOrder({
            tripId, email, phone, busOwnerName, routeName, departureTime, departureDate, pickUp, notePickUp, timePickUp, datePickUp, dropOff, noteDropOff, timeDropOff, dateDropOff,
            seats, seatCount, ticketPrice, extraCosts, discount, totalPrice, payer, paymentMethod, paidAt, isPaid
        })

        // if (response.status !== 200) cancelTransaction(transactionId)
        console.log('res', response);
        return res.status(response.status).json(response)

    } catch (e) {
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
                message: 'Id người chuyến xe không được bỏ trống!'
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

module.exports = {
    createOrder,
    getSeatsBookedByTrip,
    getDetailsOrder,
    cancelOrderDetails,
    getAllOrder
}
