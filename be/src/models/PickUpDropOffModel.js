const mongoose = require('mongoose')

const pickUpDropOffSchema = new mongoose.Schema(
    {
        tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
        stopPointId: { type: mongoose.Schema.Types.ObjectId, ref: 'StopPoint', required: true },
        time: { type: String, required: true },
        isPickUp: { type: Boolean, required: true }
    }
);
const PickUpDropOff = mongoose.model('PickUpDropOff', pickUpDropOffSchema);

module.exports = PickUpDropOff;
