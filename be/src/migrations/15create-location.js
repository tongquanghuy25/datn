'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Locations', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            province: { type: Sequelize.STRING, allowNull: false },
            district: { type: Sequelize.STRING, allowNull: false },
            place: { type: Sequelize.STRING, allowNull: false }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Locations');
    }
};
