const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema(
    {
        province: { type: String, required: true },
        district: { type: String, required: true },
        place: { type: String, required: true },
    }
);
const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
