const TripService = require('../services/TripService');


const createTrip = async (req, res) => {
    try {
        let { routeId, busId, driverId, dates, departureTime, journeyTime, ticketPrice, availableSeats, busOwnerId } = req.body
        if (!busOwnerId || !routeId || !busId || !driverId || !dates || !departureTime || !journeyTime || !ticketPrice || !availableSeats) {
            return res.status(400).json({
                message: 'Thông tin nhập vào chưa đủ !'
            })
        }


        const response = await TripService.createTrip(dates, { busOwnerId, routeId, busId, driverId, departureTime, journeyTime, ticketPrice, availableSeats })
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

const updateTrip = async (req, res) => {
    try {
        const tripId = req.params.id
        const { driver: driverId, bus: busId, status: status } = req.body
        const response = await TripService.updateTrip(tripId, { driverId, busId, status })
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
    updateTrip
}