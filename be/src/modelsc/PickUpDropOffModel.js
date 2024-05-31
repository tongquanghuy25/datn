'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PickUpDropOff extends Model {
        static associate(models) {
            PickUpDropOff.belongsTo(models.Trip, { foreignKey: 'tripId', as: 'trip' });
            PickUpDropOff.belongsTo(models.StopPoint, { foreignKey: 'stopPointId', as: 'stopPoint' });
        }
    }

    PickUpDropOff.init({
        tripId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Trips', key: 'id' } },
        stopPointId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'StopPoints', key: 'id' } },
        time: { type: DataTypes.STRING, allowNull: false },
        isPickUp: { type: DataTypes.BOOLEAN, allowNull: false }
    }, {
        sequelize,
        modelName: 'PickUpDropOff',
        timestamps: true,
    });

    return PickUpDropOff;
};
