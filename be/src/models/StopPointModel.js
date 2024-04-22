const mongoose = require('mongoose')

const stopPointSchema = new mongoose.Schema(
    {
        routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
        locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
        timeFromStart: { type: Number, required: true },
        extracost: { type: Number },
        isPickUp: { type: Boolean, require: true }
    }
);
const StopPoint = mongoose.model('StopPoint', stopPointSchema);

module.exports = StopPoint;
