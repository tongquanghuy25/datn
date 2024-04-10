const mongoose = require('mongoose')

const ratingSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
        stars: { type: Number, required: true, min: 1, max: 5 },
        content: { type: String, required: true }
    },
    {
        timestamps: true,
    }
);
const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
