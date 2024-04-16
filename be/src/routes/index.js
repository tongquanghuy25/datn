const UserRouter = require('./UserRouter')
const BusOwnerRouter = require('./BusOwnerRouter')
const DriverRouter = require('./DriverRouter')

const ProductRouter = require('./ProductRouter')
const OrderRouter = require('./OrderRouter')
const PaymentRouter = require('./PaymentRouter')

const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/bus-owner', BusOwnerRouter)
    app.use('/api/driver', DriverRouter)


    app.use('/api/product', ProductRouter)
    app.use('/api/order', OrderRouter)
    app.use('/api/payment', PaymentRouter)
}

module.exports = routes