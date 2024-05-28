const mongoose = require('mongoose')
const refundSchema = new mongoose.Schema(
    {
        busOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusOwner', required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        refundAmount: { type: Number, required: true },
        isRefund: { type: Boolean, default: false },
    },
    {
        timestamps: true
    }
);
const Refund = mongoose.model("Refund", refundSchema);
module.exports = Refund;