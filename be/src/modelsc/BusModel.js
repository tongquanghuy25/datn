const mongoose = require('mongoose')
const busSchema = new mongoose.Schema(
    {
        busOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusOwner', required: true },
        licensePlate: { type: String, required: true },
        avatar: { type: String },
        color: { type: String, required: true },
        typeBus: { type: String, required: true },
        numberSeat: { type: Number, required: true },
        floorNumber: { type: Number, required: true },
        convinients: [{ type: String }],
        images: [{ type: String }],
        isRecliningSeat: { type: Boolean, default: false }
    }
);
const Bus = mongoose.model("Bus", busSchema);
module.exports = Bus;