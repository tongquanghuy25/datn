'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Schedules', {
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
      departureTime: { type: Sequelize.TIME, allowNull: false },
      totalSeats: { type: Sequelize.INTEGER, allowNull: false },
      ticketPrice: { type: Sequelize.INTEGER, allowNull: false },
      paymentRequire: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      prebooking: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      timeAlowCancel: { type: Sequelize.INTEGER, allowNull: false },
      scheduleType: { type: Sequelize.ENUM('Daily', 'Periodic', 'WeeklyDays'), allowNull: false },
      inforSchedule: { type: Sequelize.JSON },

      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Schedules');
  }
};
