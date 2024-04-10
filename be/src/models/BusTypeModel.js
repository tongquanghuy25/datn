const mongoose = require('mongoose')

const busTypeSchema = new mongoose.Schema(
    {
        typeName: { type: String, required: true },
        numberOfSeats: { type: Number, required: true },
        isRecliningSeat: { type: Boolean, default: false }
    }
);
const BusType = mongoose.model('BusType', busTypeSchema);

module.exports = BusType;
