const mongoose = require('mongoose')

const districtSchema = new mongoose.Schema(
    {
        _id: { type: Number },
        provinceId: { type: Number },
        name: { type: String, required: true }
    }
);
const District = mongoose.model('District', districtSchema);

module.exports = District;
