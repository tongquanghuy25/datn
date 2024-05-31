'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Driver extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Driver.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
            Driver.belongsTo(models.BusOwner, { foreignKey: 'busOwnerId', as: 'busOwner' });
        }
    }

    Driver.init({
        userId: { type: DataTypes.INTEGER, allowNull: false },
        busOwnerId: { type: DataTypes.INTEGER, allowNull: false },
        citizenId: { type: DataTypes.STRING, allowNull: false },
        address: { type: DataTypes.STRING, allowNull: false },
        licenseType: { type: DataTypes.STRING, allowNull: false },
        tripNumber: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    }, {
        sequelize,
        modelName: 'Driver',
        timestamps: true
    });

    return Driver;
};
