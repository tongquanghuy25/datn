const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema(
    {
        busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
        departureDate: { type: String, required: true },
        departureTime: { type: String, required: true },
        endDate: { type: String, required: true },
        endTime: { type: String, required: true },
        availableSeats: { type: Number, required: true },
        departed: { type: Boolean, default: false },
        ended: { type: Boolean, default: false },
        ticketPrice: { type: Number, required: true }
    }
);
const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
