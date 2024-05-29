const mongoose = require('mongoose')

const provinceSchema = new mongoose.Schema(
    {
        _id: { type: Number, required: true },
        name: { type: String, required: true }
    }
);
const Province = mongoose.model('Province', provinceSchema);

module.exports = Province;
