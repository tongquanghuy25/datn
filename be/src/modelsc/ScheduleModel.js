const mongoose = require('mongoose')

const scheduleSchema = new mongoose.Schema(
    {
        busOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusOwner', required: true },
        busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
        driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
        routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
        departureTime: { type: String, required: true },
        availableSeats: { type: Number, required: true },
        ticketPrice: { type: Number, required: true },
        paymentRequire: { type: Boolean, required: true, default: true },
        prebooking: { type: Boolean, required: true, default: false },
        timeAlowCancel: { type: Number, required: true },
        scheduleType: { type: String, required: true },
        inforSchedule: { type: String },
    }
);
const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
