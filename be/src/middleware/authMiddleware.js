const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authAdminMiddleWare = (req, res, next) => {
    const token = req.headers.token?.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            console.log('ee', err);
            return res.status(401).json({
                message: 'The authemtication',
                status: 'ERR'
            })
        }
        if (user?.role === 'admin') {
            next()
        } else {
            return res.status(401).json({
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
            return res.status(401).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
        if (user?.role === 'admin' || user?.role === 'user' || user?.role === 'busowner') {
            next()
        } else {
            return res.status(401).json({
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
            return res.status(401).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
        if (user?.role === 'admin' || user?.role === 'busowner') {
            next()
        } else {
            return res.status(401).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
    });
}

const authDriverMiddleWare = (req, res, next) => {
    const token = req.headers.token.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(401).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
        if (user?.role === 'driver') {
            next()
        } else {
            return res.status(401).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
    });
}

module.exports = {
    authAdminMiddleWare,
    authUserMiddleWare,
    authBusOwnerMiddleWare,
    authDriverMiddleWare
}