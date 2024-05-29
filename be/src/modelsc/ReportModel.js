const mongoose = require('mongoose')
const reportSchema = new mongoose.Schema(
    {
        busOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusOwner', required: true },
        phone: { type: String, required: true },
        title: { type: String, required: true },
        content: { type: String, required: true },
        status: { type: String, default: 'Đang xử lý' },
    },
    {
        timestamps: true
    }
);
const Report = mongoose.model("Report", reportSchema);
module.exports = Report;