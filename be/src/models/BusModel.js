'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Bus extends Model {
        static associate(models) {
            Bus.belongsTo(models.BusOwner, { foreignKey: 'busOwnerId', as: 'busOwner' });
        }
    }

    Bus.init({
        busOwnerId: { type: DataTypes.INTEGER, allowNull: false },
        licensePlate: { type: DataTypes.STRING, allowNull: false },
        avatar: { type: DataTypes.STRING },
        color: { type: DataTypes.STRING, allowNull: false },
        typeBus: { type: DataTypes.STRING, allowNull: false },
        numberSeat: { type: DataTypes.INTEGER, allowNull: false },
        floorNumber: { type: DataTypes.INTEGER, allowNull: false },
        typeSeat: { type: DataTypes.ENUM('Sitting', 'Sleeper', 'Massage', 'BusinessClass'), allowNull: false },
        images: { type: DataTypes.JSON, allowNull: true },
        convinients: { type: DataTypes.JSON, allowNull: true },
    }, {
        sequelize,
        modelName: 'Bus',
        timestamps: true
    });

    return Bus;
};
