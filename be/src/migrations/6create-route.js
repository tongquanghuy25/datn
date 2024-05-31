'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Routes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      busOwnerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'BusOwners',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      provinceStart: { type: Sequelize.STRING, allowNull: false },
      districtStart: { type: Sequelize.STRING, allowNull: false },
      placeStart: { type: Sequelize.STRING, allowNull: false },
      provinceEnd: { type: Sequelize.STRING, allowNull: false },
      districtEnd: { type: Sequelize.STRING, allowNull: false },
      placeEnd: { type: Sequelize.STRING, allowNull: false },
      journeyTime: { type: Sequelize.TIME, allowNull: false },

      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Routes');
  }
};
