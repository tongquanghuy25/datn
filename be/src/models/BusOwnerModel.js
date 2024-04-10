const mongoose = require('mongoose')
const busOwnerSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        busOwnerName: { type: String, required: true },
        citizenId: { type: String, required: true },
        address: { type: String, required: true },
        route: { type: String, required: true },
        isAccept: { type: Boolean, default: false }

    },
    {
        timestamps: true
    }
);
const BusOwner = mongoose.model("BusOwner", busOwnerSchema);
module.exports = BusOwner;