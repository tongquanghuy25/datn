const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
// const { Sequelize } = require('sequelize');
const routes = require('./routes');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
dotenv.config();



const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(bodyParser.json());
app.use(cookieParser());
routes(app);

// const sequelize = new Sequelize('it4409', 'root', null, {
//     host: 'localhost',
//     dialect: 'mysql',
//     logging: false
// })

// async function connectToDatabase() {
//     try {
//         await sequelize.authenticate();
//         console.log('Connect Db success');
//     } catch (error) {
//         console.errorMes('Connect Db failed', error);
//     }
// }

// // Gọi hàm connectToDatabase
// connectToDatabase();

mongoose.connect(`${process.env.MONGO_DB}`)
    .then(() => {
        console.log('Connect Db monggoo success');
    })
    .catch((e) => {
        console.log('Connect Db failed', e);

    })
    .catch(err => {
        console.log(err);
    });


app.listen(port, () => {
    console.log("server listening on port: ", + port);
});