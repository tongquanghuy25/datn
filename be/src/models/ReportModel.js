'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Report extends Model {
        static associate(models) {
            // Report.belongsTo(models.BusOwner, { foreignKey: 'busOwnerId', as: 'busOwner' });
        }
    }

    Report.init({
        busOwnerId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'BusOwners', key: 'id' } },
        phone: { type: DataTypes.STRING, allowNull: false },
        title: { type: DataTypes.STRING, allowNull: false },
        content: { type: DataTypes.TEXT, allowNull: false },
        status: { type: DataTypes.ENUM('processing', 'processed'), allowNull: false, defaultValue: 'processing' }
    }, {
        sequelize,
        modelName: 'Report',
        timestamps: true,
    });

    return Report;
};
