'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Refund extends Model {
        static associate(models) {
            // Refund.belongsTo(models.BusOwner, { foreignKey: 'busOwnerId', as: 'busOwner' });
        }
    }

    Refund.init({
        busOwnerId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'BusOwners', key: 'id' } },
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        phone: { type: DataTypes.STRING, allowNull: false },
        refundAmount: { type: DataTypes.INTEGER, allowNull: false },
        isRefund: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    }, {
        sequelize,
        modelName: 'Refund',
        timestamps: true,
    });

    return Refund;
};
