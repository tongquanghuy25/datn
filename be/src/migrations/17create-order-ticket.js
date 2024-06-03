'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('OrderTickets', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            tripId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Trips',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            userOrder: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            name: { type: Sequelize.STRING, allowNull: false },
            email: { type: Sequelize.STRING, allowNull: false },
            phone: { type: Sequelize.STRING, allowNull: false },
            departureDate: { type: Sequelize.DATE, allowNull: false },
            code: { type: Sequelize.STRING, allowNull: false },

            pickUp: { type: Sequelize.STRING, allowNull: false },
            notePickUp: { type: Sequelize.TEXT, allowNull: true },
            timePickUp: { type: Sequelize.TIME, allowNull: false },
            datePickUp: { type: Sequelize.DATE, allowNull: false },
            dropOff: { type: Sequelize.STRING, allowNull: false },
            noteDropOff: { type: Sequelize.TEXT, allowNull: true },
            timeDropOff: { type: Sequelize.TIME, allowNull: false },
            dateDropOff: { type: Sequelize.DATE, allowNull: false },

            seats: { type: Sequelize.JSON, allowNull: false },
            seatCount: { type: Sequelize.INTEGER, allowNull: false },

            ticketPrice: { type: Sequelize.FLOAT, allowNull: false },
            extraCosts: { type: Sequelize.FLOAT, allowNull: true },
            discount: { type: Sequelize.FLOAT, allowNull: true },
            totalPrice: { type: Sequelize.FLOAT, allowNull: false },

            payee: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            paymentMethod: { type: Sequelize.STRING, allowNull: true },
            isPaid: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
            paidAt: { type: Sequelize.DATE, allowNull: true },

            status: { type: Sequelize.ENUM('NotBoarded', 'Boarded', 'Completed', 'Settled', 'Canceled'), allowNull: false, defaultValue: 'NotBoarded' },
            isReview: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },

            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('OrderTickets');
    }
};
