const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema(
    {
        busOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusOwner', required: true },
        busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
        driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
        routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
        departureDate: { type: String, required: true },
        departureTime: { type: String, required: true },
        // journeyTime: { type: String, required: true },
        // endDate: { type: String, required: true },
        // endTime: { type: String, required: true },
        availableSeats: { type: Number, required: true },
        ticketsSold: { type: Number, default: 0 },
        status: { type: String, required: true, default: 'Chưa khởi hành' },
        ticketPrice: { type: Number, required: true },
        paymentRequire: { type: Boolean, required: true, default: true },
        prebooking: { type: Boolean, required: true, default: false },
        timeAlowCancel: { type: String, required: true }
    }
);
const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
