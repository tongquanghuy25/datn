const mongoose = require('mongoose')

const driverSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        busOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusOwner', required: true },
        tripNumber: { type: Number, required: true, default: 0 },
        citizenId: { type: String, required: true },
        address: { type: String, required: true },
        licenseType: { type: String, required: true }
    }
);
const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
