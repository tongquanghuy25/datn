const TripService = require('../services/TripService');


const createTrip = async (req, res) => {
    try {
        let { routeId, busId, driverId, dates, departureTime, ticketPrice, totalSeats, busOwnerId, paymentRequire, prebooking, timeAlowCancel } = req.body
        if (!busOwnerId || !routeId || !busId || !driverId || !dates || !departureTime || !ticketPrice || !totalSeats || !timeAlowCancel) {
            return res.status(400).json({
                message: 'Thông tin nhập vào chưa đủ !'
            })
        }


        const response = await TripService.createTrip(dates, { busOwnerId, routeId, busId, driverId, departureTime, ticketPrice, totalSeats, paymentRequire, prebooking, timeAlowCancel })
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e.e
        })
    }
}

const getAllByBusOwner = async (req, res) => {
    try {
        const ownerId = req.params.id
        const day = req.query.day
        if (!ownerId) {
            return res.status(400).json({
                message: 'Id nhà xe không được bỏ trống!'
            })
        }
        const response = await TripService.getAllByBusOwner(ownerId, day)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllByDriver = async (req, res) => {
    try {
        const driverId = req.params.id
        const day = req.query.day
        if (!driverId) {
            return res.status(400).json({
                message: 'Id nhà xe không được bỏ trống!'
            })
        }
        const response = await TripService.getAllByDriver(driverId, day)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getRunningByDriver = async (req, res) => {
    try {
        const driverId = req.params.id
        if (!driverId) {
            return res.status(400).json({
                message: 'Id nhà xe không được bỏ trống!'
            })
        }
        const response = await TripService.getRunningByDriver(driverId)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getTripsBySearch = async (req, res) => {
    try {
        const data = req.query
        console.log(data);
        const response = await TripService.getTripsBySearch(data.data)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getTripsByFilter = async (req, res) => {
    try {
        const data = req.query
        const response = await TripService.getTripsByFilter(data.data)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateTrip = async (req, res) => {
    try {
        const tripId = req.params.id
        const { driverId, busId, status } = req.body
        const response = await TripService.updateTrip(tripId, { driverId, busId, status })
        return res.status(response.status).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateFinishTrip = async (req, res) => {
    try {
        const tripId = req.params.id
        const response = await TripService.updateFinishTrip(tripId)
        return res.status(response.status).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteTrip = async (req, res) => {
    try {
        const tripId = req.params.id
        if (!tripId) {
            return res.status(404).json({
                message: 'Id chuyến không được bỏ trống !'
            })
        }
        const response = await TripService.deleteTrip(tripId)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}



module.exports = {
    createTrip,
    getAllByBusOwner,
    deleteTrip,
    updateTrip,
    getTripsBySearch,
    getTripsByFilter,
    getAllByDriver,
    getRunningByDriver,
    updateFinishTrip
}
