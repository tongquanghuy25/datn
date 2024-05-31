'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Route extends Model {
        static associate(models) {
            Route.belongsTo(models.BusOwner, { foreignKey: 'busOwnerId', as: 'busOwner' });
        }
    }

    Route.init({
        busOwnerId: { type: DataTypes.INTEGER, allowNull: false },
        provinceStart: { type: DataTypes.STRING, allowNull: false },
        districtStart: { type: DataTypes.STRING, allowNull: false },
        placeStart: { type: DataTypes.STRING, allowNull: false },
        provinceEnd: { type: DataTypes.STRING, allowNull: false },
        districtEnd: { type: DataTypes.STRING, allowNull: false },
        placeEnd: { type: DataTypes.STRING, allowNull: false },
        journeyTime: { type: DataTypes.TIME, allowNull: false }
    }, {
        sequelize,
        modelName: 'Route',
        timestamps: true
    });

    return Route;
};
