const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        busOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusOwner', required: true },
        name: { type: String, required: true },
        stars: { type: Number, required: true, min: 1, max: 5 },
        content: { type: String, required: true }
    },
    {
        timestamps: true,
    }
);
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
