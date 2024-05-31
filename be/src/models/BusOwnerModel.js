'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class BusOwner extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            BusOwner.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        }
    }

    BusOwner.init({
        userId: { type: DataTypes.INTEGER, allowNull: false },
        busOwnerName: { type: DataTypes.STRING, allowNull: false },
        address: { type: DataTypes.STRING, allowNull: false },
        citizenId: { type: DataTypes.STRING, allowNull: false },
        companyType: { type: DataTypes.STRING, allowNull: false },
        companyDescription: { type: DataTypes.TEXT, allowNull: false },
        managerName: { type: DataTypes.STRING, allowNull: false },
        managerPhone: { type: DataTypes.STRING, allowNull: false },
        managerEmail: { type: DataTypes.STRING, allowNull: false },
        isAccept: { type: DataTypes.BOOLEAN, defaultValue: false },
        reviewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
        averageRating: { type: DataTypes.FLOAT, defaultValue: 0.0 }
    }, {
        sequelize,
        modelName: 'BusOwner',
        timestamps: true
    });

    return BusOwner;
};
