'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Discounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      busOwnerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'BusOwners',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      code: { type: Sequelize.STRING, allowNull: false },
      discountType: { type: Sequelize.ENUM('Percent', 'Fixed'), allowNull: false },
      discountValue: { type: Sequelize.INTEGER, allowNull: false },
      startDate: { type: Sequelize.DATE, allowNull: false },
      endDate: { type: Sequelize.DATE, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      numberUses: { type: Sequelize.INTEGER, allowNull: false },

      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Discounts');
  }
};
