const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    // orderItems: [
    //     {
    //         name: { type: String, required: true },
    //         amount: { type: Number, required: true },
    //         image: { type: String, required: true },
    //         price: { type: Number, required: true },
    //         discount: { type: Number },
    //         product: {
    //             type: mongoose.Schema.Types.ObjectId,
    //             ref: 'Product',
    //             required: true,
    //         },
    //     },
    // ],

    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    payer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    email: { type: String, required: true },
    phone: { type: String, required: true },

    pickUp: { type: String, required: true },
    notePickUp: { type: String, required: true },
    dropOff: { type: String, required: true },
    noteDropOff: { type: String, required: true },

    seats: { type: [String], required: true },
    seatCount: { type: Number, required: true },

    ticketPrice: { type: Number, required: true },
    extraCosts: { type: Number },
    discount: { type: Number },
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
},
    {
        timestamps: true,
    }
);
const Order = mongoose.model('Order', orderSchema);
module.exports = Order