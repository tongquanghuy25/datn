const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({

    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    departureDate: { type: String, required: true },


    pickUp: { type: String, required: true },
    notePickUp: { type: String },
    timePickUp: { type: String, required: true },
    datePickUp: { type: String, required: true },
    dropOff: { type: String, required: true },
    noteDropOff: { type: String },
    timeDropOff: { type: String, required: true },
    dateDropOff: { type: String, required: true },

    seats: { type: [String], required: true },
    seatCount: { type: Number, required: true },

    ticketPrice: { type: Number, required: true },
    extraCosts: { type: Number },
    discount: { type: Number },
    totalPrice: { type: Number, required: true },

    payer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    paymentMethod: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },

    status: { type: String },
},
    {
        timestamps: true,
    }
);
const Order = mongoose.model('Order', orderSchema);
module.exports = Order