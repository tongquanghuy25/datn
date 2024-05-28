const mongoose = require('mongoose')

const orderGoodsSchema = new mongoose.Schema({

    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    departureDate: { type: String, required: true },

    nameSender: { type: String, required: true },
    emailSender: { type: String, required: true },
    phoneSender: { type: String, required: true },
    nameReceiver: { type: String, required: true },
    emailReceiver: { type: String, required: true },
    phoneReceiver: { type: String, required: true },


    sendPlace: { type: String, required: true },
    noteSend: { type: String },
    timeSend: { type: String, required: true },
    dateSend: { type: String, required: true },

    receivePlace: { type: String, required: true },
    noteReceive: { type: String },
    timeReceive: { type: String, required: true },
    dateReceive: { type: String, required: true },

    goodsName: { type: String, required: true },
    goodsDescription: { type: String, required: true },

    price: { type: Number, required: true },

    Payee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    paymentMethod: { type: String },
    isPaid: { type: Boolean, default: false },

    isCancel: { type: Boolean, default: false },
    status: { type: String, default: 'Chưa nhận hàng' },
    isFinish: { type: Boolean, default: false },

},
    {
        timestamps: true,
    }
);
const OrderGoods = mongoose.model('OrderGoods', orderGoodsSchema);
module.exports = OrderGoods