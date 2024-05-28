const UserRouter = require('./UserRouter')
const PartnerRouter = require('./PartnerRouter')
const DriverRouter = require('./DriverRouter')
const BusRouter = require('./BusRouter')
const PlaceRouter = require('./PlaceRouter')
const RouteRouter = require('./RouteRouter')
const TripRouter = require('./TripRouter')
const OrderRouter = require('./OrderRouter')
const DiscountRouter = require('./DiscountRouter')
const ReviewRouter = require('./ReviewRouter')
const ScheduleRouter = require('./ScheduleRouter')


const ProductRouter = require('./ProductRouter')
const PaymentRouter = require('./PaymentRouter')

const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/partner', PartnerRouter)
    app.use('/api/driver', DriverRouter)
    app.use('/api/bus', BusRouter)
    app.use('/api/place', PlaceRouter)
    app.use('/api/route', RouteRouter)
    app.use('/api/trip', TripRouter)
    app.use('/api/schedule', ScheduleRouter)
    app.use('/api/order', OrderRouter)
    app.use('/api/discount', DiscountRouter)
    app.use('/api/review', ReviewRouter)



    app.use('/api/product', ProductRouter)
    app.use('/api/payment', PaymentRouter)
}

module.exports = routes