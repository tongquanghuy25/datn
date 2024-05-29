const mongoose = require('mongoose')
const discountSchema = new mongoose.Schema(
    {
        code: { type: String, required: true },
        discountType: { type: String, required: true },
        discountValue: { type: Number, required: true },
        startDate: { type: String, required: true },
        endDate: { type: String, required: true },
        description: { type: String, required: true },
        numberUses: { type: Number, required: true },
        busOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusOwner' },
    }
);
const Discount = mongoose.model("Discount", discountSchema);
module.exports = Discount;