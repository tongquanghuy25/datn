'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Trip extends Model {
        static associate(models) {
            Trip.belongsTo(models.BusOwner, { foreignKey: 'busOwnerId', as: 'busOwner' });
            Trip.belongsTo(models.Bus, { foreignKey: 'busId', as: 'bus' });
            Trip.belongsTo(models.Driver, { foreignKey: 'driverId', as: 'driver' });
            Trip.belongsTo(models.Route, { foreignKey: 'routeId', as: 'route' });
        }
    }

    Trip.init({
        busOwnerId: { type: DataTypes.INTEGER, allowNull: false },
        busId: { type: DataTypes.INTEGER, allowNull: false },
        driverId: { type: DataTypes.INTEGER, allowNull: false },
        routeId: { type: DataTypes.INTEGER, allowNull: false },
        departureDate: { type: DataTypes.DATE, allowNull: false },
        departureTime: { type: DataTypes.TIME, allowNull: false },
        totalSeats: { type: DataTypes.INTEGER, allowNull: false },
        bookedSeats: { type: DataTypes.INTEGER, defaultValue: 0 },
        status: { type: DataTypes.ENUM('NotStarted', 'Started', 'Ended', 'Cancelled'), allowNull: false, defaultValue: 'NotStarted' },
        ticketPrice: { type: DataTypes.INTEGER, allowNull: false },
        paymentRequire: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        prebooking: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        timeAlowCancel: { type: DataTypes.STRING, allowNull: false }
    }, {
        sequelize,
        modelName: 'Trip',
        timestamps: false
    });

    return Trip;
};
