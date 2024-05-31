'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
        }
    }
    User.init({
        name: { type: DataTypes.STRING, allowNull: true },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        phone: { type: DataTypes.STRING, allowNull: false },
        avatar: { type: DataTypes.STRING, allowNull: true },
        role: { type: DataTypes.ENUM('ADMIN', 'BUSOWNER', 'DRIVER', 'AGENT', 'USER'), allowNull: false, defaultValue: 'USER' },
        gender: { type: DataTypes.STRING, allowNull: true },
        dateOfBirth: { type: DataTypes.DATE, allowNull: true }
    }, {
        sequelize,
        modelName: 'User',
        timestamps: true
    });
    return User;
};