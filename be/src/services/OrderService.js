const Order = require("../models/OrderModel")
const Trip = require("../models/TripModel")
const EmailService = require("../services/EmailService")

const mongoose = require('mongoose');
const { generateQRCode } = require("./QrCodeService");

// Import các module và class từ Mongoose
const { startSession } = mongoose;

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {

        const session = await startSession();
        session.startTransaction();
        try {
            // const promises = orderItems.map(async (order) => {
            //     const productData = await Product.findOneAndUpdate(
            //         {
            //             _id: order.product,
            //             countInStock: { $gte: order.amount }
            //         },
            //         {
            //             $inc: {
            //                 countInStock: -order.amount,
            //                 selled: +order.amount
            //             }
            //         },
            //         { new: true }
            //     )

            //     if (productData) {
            //         return {
            //             status: 'OK',
            //             message: 'SUCCESS'
            //         }
            //     }
            //     else {
            //         return {
            //             status: 'OK',
            //             message: 'ERR',
            //             id: order.product
            //         }
            //     }
            // })
            // const results = await Promise.all(promises)
            // const newData = results && results.filter((item) => item.id)
            // if (newData.length) {
            //     const arrId = []
            //     newData.forEach((item) => {
            //         arrId.push(item.id)
            //     })
            //     resolve({
            //         status: 'ERR',
            //         message: `San pham voi id: ${arrId.join(',')} khong du hang`
            //     })
            // } else {
            //     const createdOrder = await Order.create({
            //         orderItems,
            //         shippingAddress: {
            //             fullName,
            //             address,
            //             city, phone
            //         },
            //         paymentMethod,
            //         itemsPrice,
            //         shippingPrice,
            //         totalPrice,
            //         user: user,
            //         isPaid, paidAt
            //     })
            //     if (createdOrder) {
            //         await EmailService.sendEmailCreateOrder(email, orderItems)
            //         resolve({
            //             status: 'OK',
            //             message: 'success'
            //         })
            //     }
            // }

            // Kiểm tra số lượng ghế trống trong chuyến đi

            // const { tripId, email, phone,busOwnerName, routeName, departureTime, departureDate, pickUp, notePickUp, timePickUp, datePickUp, dropOff, noteDropOff, timeDropOff, dateDropOff,
            //     seats, seatCount, ticketPrice, extraCosts, discount, totalPrice, payer, paymentMethod, paidAt, isPaid } = newOrder

            // const trip = await Trip.findOneAndUpdate(
            //     {
            //         _id: tripId,
            //         availableSeats: { $gte: seatCount }
            //     },
            //     {
            //         $inc: {
            //             availableSeats: -seatCount
            //         }

            //     },
            //     { new: true, session }
            // );

            // if (!trip) {
            //     await session.abortTransaction();
            //     session.endSession();

            //     resolve({
            //         status: 400,
            //         message: 'Chuyến đi không tồn tại!'
            //     })
            //     return
            // }

            // // Kiểm tra các ghế đã được đặt hay chưa
            // const existingOrders = await Order.find({ tripId, seats: { $in: seats } });
            // if (existingOrders.length > 0) {
            //     await session.abortTransaction();
            //     session.endSession();
            //     resolve({
            //         status: 400,
            //         message: 'Một số ghế đã được đặt bởi người khác!'
            //     })
            //     return
            // }




            // const createdOrder = await Order.create(
            //     {
            //         tripId: tripId,
            //         email: email,
            //         phone: phone,
            // busOwnerName:busOwnerName, 
            // routeName:routeName, 
            // departureTime:departureTime,
            //         departureDate: departureDate,

            //         pickUp: pickUp,
            //         notePickUp: notePickUp,
            //         timePickUp: timePickUp,
            //         datePickUp: datePickUp,
            //         dropOff: dropOff,
            //         noteDropOff: noteDropOff,
            //         timeDropOff: timeDropOff,
            //         dateDropOff: dateDropOff,

            //         seats: seats,
            //         seatCount: seatCount,

            //         ticketPrice: ticketPrice,
            //         extraCosts: extraCosts,
            //         discount: discount,
            //         totalPrice: totalPrice,

            //         payer: payer,
            //         paymentMethod: paymentMethod,
            //         isPaid: isPaid,
            //         paidAt: paidAt
            //     }
            // );
            // await session.commitTransaction();
            // session.endSession();

            // if (createdOrder) {
            //     console.log('createdOrder', createdOrder);
            //     await EmailService.sendEmailCreateOrder()
            //     resolve({
            //         status: 200,
            //         message: 'Tạo đơn đặt vé thành công!',
            //         data: createdOrder
            //     })
            // }

            await EmailService.sendEmailCreateOrder(newOrder)

        } catch (e) {
            console.log(e);
            await session.abortTransaction();
            session.endSession();
            reject(e)
        }
    })
}

// const deleteManyProduct = (ids) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             await Product.deleteMany({ _id: ids })
//             resolve({
//                 status: 'OK',
//                 message: 'Delete product success',
//             })
//         } catch (e) {
//             reject(e)
//         }
//     })
// }

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

            const allSeats = await Order.distinct('seats', { tripId: tripId });

            console.log('orders', allSeats);
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

const getOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById({
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

const cancelOrderDetails = (id, data) => {
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
                    order = await Order.findByIdAndDelete(id)
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

const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find().sort({ createdAt: -1, updatedAt: -1 })
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

module.exports = {
    createOrder,
    getSeatsBookedByTrip,
    getOrderDetails,
    cancelOrderDetails,
    getAllOrder
}