'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Reports', {
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
            phone: { type: Sequelize.STRING, allowNull: false },
            title: { type: Sequelize.STRING, allowNull: false },
            content: { type: Sequelize.TEXT, allowNull: false },
            status: { type: Sequelize.ENUM('processing', 'processed'), allowNull: false, defaultValue: 'processing' },
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Reports');
    }
};
