'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('StopPoints', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
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
            locationId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Locations',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            timeFromStart: { type: Sequelize.INTEGER, allowNull: false },
            extracost: { type: Sequelize.INTEGER },
            isPickUp: { type: Sequelize.BOOLEAN, allowNull: false }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('StopPoints');
    }
};
