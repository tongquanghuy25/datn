'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Trips', {
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
      busId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Buses',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      driverId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Drivers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      routeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Routes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      departureDate: { type: Sequelize.DATE, allowNull: false },
      departureTime: { type: Sequelize.TIME, allowNull: false },
      totalSeats: { type: Sequelize.INTEGER, allowNull: false },
      bookedSeats: { type: Sequelize.INTEGER, defaultValue: 0 },
      status: { type: Sequelize.ENUM('NotStarted', 'Started', 'Ended', 'Cancelled'), allowNull: false, defaultValue: 'NotStarted' },
      ticketPrice: { type: Sequelize.INTEGER, allowNull: false },
      paymentRequire: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      prebooking: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      timeAlowCancel: { type: Sequelize.STRING, allowNull: false }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Trips');
  }
};
