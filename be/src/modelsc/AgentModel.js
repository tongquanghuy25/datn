const mongoose = require('mongoose')
const agentSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        agentName: { type: String, required: true },
        address: { type: String, required: true },
        citizenId: { type: String, required: true },
        companyType: { type: String, required: true },
        companyDescription: { type: String, required: true },
        managerName: { type: String, required: true },
        managerPhone: { type: String, required: true },
        managerEmail: { type: String, required: true },
        isAccept: { type: Boolean, default: false },
    },
    {
        timestamps: true
    }
);
const Agent = mongoose.model("Agent", agentSchema);
module.exports = Agent;