'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        static associate(models) {
            Review.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
            Review.belongsTo(models.BusOwner, { foreignKey: 'busOwnerId', as: 'busOwner' });
        }
    }

    Review.init({
        userId: { type: DataTypes.INTEGER, allowNull: false },
        busOwnerId: { type: DataTypes.INTEGER, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        stars: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
        content: { type: DataTypes.TEXT, allowNull: false }
    }, {
        sequelize,
        modelName: 'Review',
        timestamps: true,
    });

    return Review;
};
