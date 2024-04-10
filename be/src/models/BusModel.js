const mongoose = require('mongoose')
const busSchema = new mongoose.Schema(
    {
        busOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusOwner', required: true },
        licensePlate: { type: String, required: true },
        avatar: { type: String },
        color: { type: String },
        Type: { type: mongoose.Schema.Types.ObjectId, ref: 'BusType' },
        reviewCount: { type: Number, default: 0 },
        averageRating: { type: Number, default: 0 },
        images: [{ type: String }]
    }
);
const Bus = mongoose.model("Bus", busSchema);
module.exports = Bus;