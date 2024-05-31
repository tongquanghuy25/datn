'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Schedule extends Model {
        static associate(models) {
            Schedule.belongsTo(models.BusOwner, { foreignKey: 'busOwnerId', as: 'busOwner' });
            Schedule.belongsTo(models.Bus, { foreignKey: 'busId', as: 'bus' });
            Schedule.belongsTo(models.Driver, { foreignKey: 'driverId', as: 'driver' });
            Schedule.belongsTo(models.Route, { foreignKey: 'routeId', as: 'route' });
        }
    }

    Schedule.init({
        busOwnerId: { type: DataTypes.INTEGER, allowNull: false },
        busId: { type: DataTypes.INTEGER, allowNull: false },
        driverId: { type: DataTypes.INTEGER, allowNull: false },
        routeId: { type: DataTypes.INTEGER, allowNull: false },
        departureTime: { type: DataTypes.TIME, allowNull: false },
        totalSeats: { type: DataTypes.INTEGER, allowNull: false },
        ticketPrice: { type: DataTypes.INTEGER, allowNull: false },
        paymentRequire: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        prebooking: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        timeAlowCancel: { type: DataTypes.INTEGER, allowNull: false },
        scheduleType: { type: DataTypes.ENUM('Daily', 'Periodic', 'WeeklyDays'), allowNull: false },
        inforSchedule: { type: DataTypes.JSON }
    }, {
        sequelize,
        modelName: 'Schedule',
        timestamps: true
    });

    return Schedule;
};
