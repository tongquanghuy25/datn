'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Discount extends Model {
        static associate(models) {
            Discount.belongsTo(models.BusOwner, { foreignKey: 'busOwnerId', as: 'busOwner' });
        }
    }

    Discount.init({
        busOwnerId: { type: DataTypes.INTEGER, allowNull: true },
        code: { type: DataTypes.STRING(8), allowNull: false },
        discountType: { type: DataTypes.ENUM('Percent', 'Fixed'), allowNull: false },
        discountValue: { type: DataTypes.INTEGER, allowNull: false },
        startDate: { type: DataTypes.STRING, allowNull: false },
        endDate: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: false },
        numberUses: { type: DataTypes.INTEGER, allowNull: false },
    }, {
        sequelize,
        modelName: 'Discount',
        timestamps: true
    });

    return Discount;
};
