'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Province extends Model {
        static associate(models) {
            // Province.hasMany(models.District, { foreignKey: 'provinceId', as: 'districts' });
        }
    }

    Province.init({
        id: { type: DataTypes.INTEGER, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false }
    }, {
        sequelize,
        modelName: 'Province',
        timestamps: false
    });

    return Province;
};
