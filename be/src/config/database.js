const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('datn', 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

async function connectToDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connect Db success');
    } catch (error) {
        console.log('Connect Db failed', error);
    }
}

// Gọi hàm connectToDatabase
connectToDatabase();

module.exports = sequelize;