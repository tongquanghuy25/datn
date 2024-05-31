'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class StopPoint extends Model {
        static associate(models) {
            StopPoint.belongsTo(models.Route, { foreignKey: 'routeId', as: 'route' });
            StopPoint.belongsTo(models.Location, { foreignKey: 'locationId', as: 'location' });
        }
    }

    StopPoint.init({
        routeId: { type: DataTypes.INTEGER, allowNull: false },
        locationId: { type: DataTypes.INTEGER, allowNull: false },
        timeFromStart: { type: DataTypes.INTEGER, allowNull: false },
        extracost: { type: DataTypes.INTEGER },
        isPickUp: { type: DataTypes.BOOLEAN, allowNull: false }
    }, {
        sequelize,
        modelName: 'StopPoint',
        timestamps: false
    });

    return StopPoint;
};
