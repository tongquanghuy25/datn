'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Agent extends Model {
        static associate(models) {
            Agent.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        }
    }

    Agent.init({
        userId: { type: DataTypes.INTEGER, allowNull: false },
        agentName: { type: DataTypes.STRING, allowNull: false },
        address: { type: DataTypes.STRING, allowNull: false },
        citizenId: { type: DataTypes.STRING, allowNull: false },
        companyType: { type: DataTypes.STRING, allowNull: false },
        companyDescription: { type: DataTypes.TEXT, allowNull: false },
        managerName: { type: DataTypes.STRING, allowNull: false },
        managerPhone: { type: DataTypes.STRING, allowNull: false },
        managerEmail: { type: DataTypes.STRING, allowNull: false },
        isAccept: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, {
        sequelize,
        modelName: 'Agent',
        timestamps: true
    });

    return Agent;
};
