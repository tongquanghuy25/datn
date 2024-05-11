const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({

    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    departureDate: { type: String, required: true },

    nameSender: { type: String, required: true },
    phoneSender: { type: String, required: true },
    nameReceiver: { type: String, required: true },
    phoneReceiver: { type: String, required: true },



    sendPlace: { type: String, required: true },
    noteSend: { type: String },
    timeSend: { type: String, required: true },
    dateSend: { type: String, required: true },
    receivePlace: { type: String, required: true },
    noteReceive: { type: String },
    timeReceive: { type: String, required: true },
    dateReceive: { type: String, required: true },

    description: { type: String, required: true },
    note: { type: String },

    price: { type: Number, required: true },
    discount: { type: Number },
    totalPrice: { type: Number, required: true },

    payer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    paymentMethod: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },

    isCancel: { type: Boolean, default: false },
    status: { type: String, default: 'Chưa nhận hàng' },
},
    {
        timestamps: true,
    }
);
const Order = mongoose.model('Order', orderSchema);
module.exports = Order