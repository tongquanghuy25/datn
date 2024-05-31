'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Location extends Model {
        static associate(models) {
            // Không có quan hệ cần định nghĩa
        }
    }

    Location.init({
        province: { type: DataTypes.STRING, allowNull: false },
        district: { type: DataTypes.STRING, allowNull: false },
        place: { type: DataTypes.STRING, allowNull: false }
    }, {
        sequelize,
        modelName: 'Location',
        timestamps: false
    });

    return Location;
};
