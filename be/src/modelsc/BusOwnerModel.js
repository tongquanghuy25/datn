const mongoose = require('mongoose')
const busOwnerSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        busOwnerName: { type: String, required: true },
        address: { type: String, required: true },
        citizenId: { type: String, required: true },
        companyType: { type: String, required: true },
        companyDescription: { type: String, required: true },
        managerName: { type: String, required: true },
        managerPhone: { type: String, required: true },
        managerEmail: { type: String, required: true },
        isAccept: { type: Boolean, default: false },
        reviewCount: { type: Number, default: 0 },
        averageRating: { type: Number, default: 0.0 },
    },
    {
        timestamps: true
    }
);
const BusOwner = mongoose.model("BusOwner", busOwnerSchema);
module.exports = BusOwner;