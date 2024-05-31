'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Image extends Model {
        static associate(models) {
            Image.belongsTo(models.Bus, { foreignKey: 'busId', as: 'bus' });
        }
    }

    Image.init({
        busId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Buses', key: 'id' } },
        publicId: { type: DataTypes.STRING, allowNull: false },
        url: { type: DataTypes.STRING },
    }, {
        sequelize,
        modelName: 'Image',
    });

    return Image;
};
