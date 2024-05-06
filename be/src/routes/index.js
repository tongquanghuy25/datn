const UserRouter = require('./UserRouter')
const BusOwnerRouter = require('./BusOwnerRouter')
const DriverRouter = require('./DriverRouter')
const BusRouter = require('./BusRouter')
const PlaceRouter = require('./PlaceRouter')
const RouteRouter = require('./RouteRouter')
const TripRouter = require('./TripRouter')
const OrderRouter = require('./OrderRouter')


const ProductRouter = require('./ProductRouter')
const PaymentRouter = require('./PaymentRouter')

const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/bus-owner', BusOwnerRouter)
    app.use('/api/driver', DriverRouter)
    app.use('/api/bus', BusRouter)
    app.use('/api/place', PlaceRouter)
    app.use('/api/route', RouteRouter)
    app.use('/api/trip', TripRouter)
    app.use('/api/order', OrderRouter)



    app.use('/api/product', ProductRouter)
    app.use('/api/payment', PaymentRouter)
}

module.exports = routes