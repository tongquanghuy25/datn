const mongoose = require('mongoose')

const routeSchema = new mongoose.Schema(
    {
        busOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusOwner', required: true },
        provinceStart: { type: String, required: true },
        districtStart: { type: String, required: true },
        provinceEnd: { type: String, required: true },
        districtEnd: { type: String, required: true },
        journeyTime: { type: String, required: true },
    }
);
const Route = mongoose.model('Route', routeSchema);

module.exports = Route;
