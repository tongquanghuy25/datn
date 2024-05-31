const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authAdminMiddleWare = (req, res, next) => {
    const token = req.headers.token?.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(401).json({
                message: 'The authemtication',
                status: 'ERR'
            })
        }
        if (user?.role === 'ADMIN') {
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
    const token = req.headers.token?.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(401).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
        if (user?.role === 'ADMIN' || user?.role === 'USER' || user?.role === 'BUSOWNER' || user?.role === 'DRIVER' || user?.role === 'AGENT') {
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
    const token = req.headers.token?.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(401).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
        if (user?.role === 'ADMIN' || user?.role === 'BUSOWNER') {
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

    const token = req.headers.token?.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(401).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
        if (user?.role === 'ADMIN' || user?.role === 'BUSOWNER' || user?.role === 'DRIVER' || user?.role === 'AGENT') {
            next()
        } else {
            return res.status(401).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
    });
}

const authAgentMiddleWare = (req, res, next) => {

    const token = req.headers.token?.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(401).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
        if (user?.role === 'ADMIN' || user?.role === 'BUSOWNER' || user?.role === 'AGENT') {
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
    authDriverMiddleWare,
    authAgentMiddleWare
}