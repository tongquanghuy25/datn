const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema(
    {
        tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        seat: { type: String, required: true },
        totalPrice: { type: Number, required: true },
        paymentMethod: { type: String, required: true },
        pickupPointId: { type: mongoose.Schema.Types.ObjectId, ref: 'PickUpDropOff', required: true },
        dropOffPointId: { type: mongoose.Schema.Types.ObjectId, ref: 'PickUpDropOff', required: true }
    }
);
const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
