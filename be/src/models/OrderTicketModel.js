'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OrderTicket extends Model {
        static associate(models) {
            // OrderTicket.belongsTo(models.Trip, { foreignKey: 'tripId', as: 'trip' });
            // OrderTicket.belongsTo(models.User, { foreignKey: 'userOrder', as: 'userorder' });
            // OrderTicket.belongsTo(models.User, { foreignKey: 'payee', as: 'payee' });
        }
    }

    OrderTicket.init({
        tripId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Trips', key: 'id' } },
        userOrder: { type: DataTypes.INTEGER, references: { model: 'Users', key: 'id' } },
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        phone: { type: DataTypes.STRING, allowNull: false },
        departureDate: { type: DataTypes.DATE, allowNull: false },

        pickUp: { type: DataTypes.STRING, allowNull: false },
        notePickUp: { type: DataTypes.TEXT, allowNull: true },
        timePickUp: { type: DataTypes.TIME, allowNull: false },
        datePickUp: { type: DataTypes.DATE, allowNull: false },
        dropOff: { type: DataTypes.STRING, allowNull: false },
        noteDropOff: { type: DataTypes.TEXT, allowNull: true },
        timeDropOff: { type: DataTypes.TIME, allowNull: false },
        dateDropOff: { type: DataTypes.DATE, allowNull: false },

        // seats: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
        seatCount: { type: DataTypes.INTEGER, allowNull: false },

        ticketPrice: { type: DataTypes.INTEGER, allowNull: false },
        extraCosts: { type: DataTypes.INTEGER, allowNull: true },
        discount: { type: DataTypes.INTEGER, allowNull: true },
        totalPrice: { type: DataTypes.INTEGER, allowNull: false },

        payee: { type: DataTypes.INTEGER, references: { model: 'Users', key: 'id' } },
        paymentMethod: { type: DataTypes.STRING, allowNull: true },
        isPaid: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        paidAt: { type: DataTypes.DATE, allowNull: true },

        status: { type: DataTypes.ENUM('NotBoarded', 'Boarded', 'Completed', 'Settled', 'Canceled'), allowNull: false, defaultValue: 'NotBoarded' },
        isReview: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    }, {
        sequelize,
        modelName: 'OrderTicket',
        timestamps: true,
    });

    return OrderTicket;
};
