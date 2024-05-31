'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class District extends Model {
        static associate(models) {
            // District.belongsTo(models.Province, { foreignKey: 'provinceId', as: 'province' });
        }
    }

    District.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        provinceId: { type: DataTypes.INTEGER, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false }
    }, {
        sequelize,
        modelName: 'District',
        timestamps: false
    });

    return District;
};
