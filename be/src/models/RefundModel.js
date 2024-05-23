const mongoose = require('mongoose')
const refundSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        refundAmount: { type: Number, required: true }
    },
    {
        timestamps: true
    }
);
const Refund = mongoose.model("Refund", refundSchema);
module.exports = Refund;