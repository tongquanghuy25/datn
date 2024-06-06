'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OrderGoods extends Model {
        static associate(models) {
            OrderGoods.belongsTo(models.Trip, { foreignKey: 'tripId', as: 'trip' });
            OrderGoods.belongsTo(models.User, { foreignKey: 'Payee', as: 'payee' });
        }
    }

    OrderGoods.init({
        tripId: { type: DataTypes.INTEGER, allowNull: false },
        departureDate: { type: DataTypes.STRING, allowNull: false },
        code: { type: DataTypes.STRING, allowNull: false },

        nameSender: { type: DataTypes.STRING, allowNull: false },
        emailSender: { type: DataTypes.STRING, allowNull: false },
        phoneSender: { type: DataTypes.STRING, allowNull: false },
        nameReceiver: { type: DataTypes.STRING, allowNull: false },
        emailReceiver: { type: DataTypes.STRING, allowNull: false },
        phoneReceiver: { type: DataTypes.STRING, allowNull: false },

        sendPlace: { type: DataTypes.STRING, allowNull: false },
        noteSend: { type: DataTypes.TEXT, allowNull: true },
        timeSend: { type: DataTypes.TIME, allowNull: false },
        dateSend: { type: DataTypes.DATE, allowNull: false },

        receivePlace: { type: DataTypes.STRING, allowNull: false },
        noteReceive: { type: DataTypes.TEXT, allowNull: true },
        timeReceive: { type: DataTypes.TIME, allowNull: false },
        dateReceive: { type: DataTypes.DATE, allowNull: false },

        // weight: { type: DataTypes.INTEGER, allowNull: false },
        goodsName: { type: DataTypes.TEXT, allowNull: false },
        goodsDescription: { type: DataTypes.TEXT, allowNull: false },

        price: { type: DataTypes.INTEGER, allowNull: false },

        Payee: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'Users', key: 'id' } },
        paymentMethod: { type: DataTypes.STRING, allowNull: true },
        isPaid: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

        status: { type: DataTypes.ENUM('Pending', 'Received', 'Delivered', 'Settled', 'Cancelled'), allowNull: false, defaultValue: 'Pending' },
    }, {
        sequelize,
        modelName: 'OrderGoods',
        timestamps: true,
    });

    return OrderGoods;
};
