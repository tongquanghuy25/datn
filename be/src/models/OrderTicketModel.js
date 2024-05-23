const mongoose = require('mongoose')

const orderTicketSchema = new mongoose.Schema({

    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    userOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
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

    payee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    paymentMethod: { type: String },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },

    isCancel: { type: Boolean, default: false },
    status: { type: String, default: 'Chưa lên xe' },
    isFinish: { type: Boolean, default: false },
},
    {
        timestamps: true,
    }
);
const OrderTicket = mongoose.model('OrderTicket', orderTicketSchema);
module.exports = OrderTicket