'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('OrderGoods', {
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
            departureDate: { type: Sequelize.DATE, allowNull: false },
            code: { type: Sequelize.STRING, allowNull: false },

            nameSender: { type: Sequelize.STRING, allowNull: false },
            emailSender: { type: Sequelize.STRING, allowNull: false },
            phoneSender: { type: Sequelize.STRING, allowNull: false },
            nameReceiver: { type: Sequelize.STRING, allowNull: false },
            emailReceiver: { type: Sequelize.STRING, allowNull: false },
            phoneReceiver: { type: Sequelize.STRING, allowNull: false },

            sendPlace: { type: Sequelize.STRING, allowNull: false },
            noteSend: { type: Sequelize.TEXT, allowNull: true },
            timeSend: { type: Sequelize.TIME, allowNull: false },
            dateSend: { type: Sequelize.DATE, allowNull: false },

            receivePlace: { type: Sequelize.STRING, allowNull: false },
            noteReceive: { type: Sequelize.TEXT, allowNull: true },
            timeReceive: { type: Sequelize.TIME, allowNull: false },
            dateReceive: { type: Sequelize.DATE, allowNull: false },

            // weight: { type: Sequelize.INTEGER, allowNull: false },
            goodsName: { type: Sequelize.TEXT, allowNull: false },
            goodsDescription: { type: Sequelize.TEXT, allowNull: false },

            price: { type: Sequelize.INTEGER, allowNull: false },

            Payee: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },

            paymentMethod: { type: Sequelize.STRING, allowNull: true },
            isPaid: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
            status: { type: Sequelize.ENUM('Pending', 'Received', 'Delivered', 'Settled', 'Cancelled'), allowNull: false, defaultValue: 'Pending' },
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('OrderGoods');
    }
};
