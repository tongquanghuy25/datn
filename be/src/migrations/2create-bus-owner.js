'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BusOwners', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      busOwnerName: { type: Sequelize.STRING, allowNull: false },
      address: { type: Sequelize.STRING, allowNull: false },
      citizenId: { type: Sequelize.STRING, allowNull: false },
      companyType: { type: Sequelize.STRING, allowNull: false },
      companyDescription: { type: Sequelize.TEXT, allowNull: false },
      managerName: { type: Sequelize.STRING, allowNull: false },
      managerPhone: { type: Sequelize.STRING, allowNull: false },
      managerEmail: { type: Sequelize.STRING, allowNull: false },
      isAccept: { type: Sequelize.BOOLEAN, defaultValue: false },
      reviewCount: { type: Sequelize.INTEGER, defaultValue: 0 },
      averageRating: { type: Sequelize.FLOAT, defaultValue: 0.0 },

      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserTests');
  }
};