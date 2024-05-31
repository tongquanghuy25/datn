'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Districts', {
      id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
      provinceId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Provinces', key: 'id' } },
      name: { type: Sequelize.STRING, allowNull: false }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Districts');
  }
};
