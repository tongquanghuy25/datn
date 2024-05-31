'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Buses', {
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
      licensePlate: { type: Sequelize.STRING, allowNull: false },
      avatar: { type: Sequelize.STRING },
      color: { type: Sequelize.STRING, allowNull: false },
      typeBus: { type: Sequelize.STRING, allowNull: false },
      numberSeat: { type: Sequelize.INTEGER, allowNull: false },
      floorNumber: { type: Sequelize.INTEGER, allowNull: false },
      typeSeat: { type: Sequelize.ENUM('Sitting', 'Sleeper', 'Massage', 'BusinessClass'), allowNull: false },
      images: { type: Sequelize.JSON, allowNull: true },
      convinients: { type: Sequelize.JSON, allowNull: true },

      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Buses');
  }
};
