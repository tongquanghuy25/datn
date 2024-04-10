const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authAdminMiddleWare = (req, res, next) => {
    const token = req.headers.token.split(' ')[1]

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            console.log('hh');
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERR'
            })
        }
        if (user?.role === 'admin') {
            console.log(token);

            next()
        } else {
            console.log('hh1');

            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERR'
            })
        }
    });
}

const authUserMiddleWare = (req, res, next) => {
    const token = req.headers.token.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            console.log('aa', token);
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
        if (user?.role === 'admin' || user?.role === 'user' || user?.role === 'busowner') {
            next()
        } else {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
    });
}

const authBusOwnerMiddleWare = (req, res, next) => {
    const token = req.headers.token.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
        if (user?.role === 'admin' || user?.role === 'busowner') {
            next()
        } else {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
    });
}

module.exports = {
    authAdminMiddleWare,
    authUserMiddleWare,
    authBusOwnerMiddleWare
}