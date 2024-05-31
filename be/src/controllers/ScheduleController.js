const ScheduleService = require('../services/ScheduleService');


const createSchedule = async (req, res) => {
    try {
        let { busOwnerId, routeId, busId, driverId, departureTime, ticketPrice, totalSeats, paymentRequire, prebooking, timeAlowCancel, scheduleType, inforSchedule } = req.body
        if (!busOwnerId || !routeId || !busId || !driverId || !departureTime || !ticketPrice || !totalSeats || !timeAlowCancel || !scheduleType) {
            return res.status(400).json({
                message: 'Thông tin nhập vào chưa đủ !'
            })
        }
        const response = await ScheduleService.createSchedule({ busOwnerId, routeId, busId, driverId, departureTime, ticketPrice, totalSeats, paymentRequire, prebooking, timeAlowCancel, scheduleType, inforSchedule })
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
        if (!ownerId) {
            return res.status(400).json({
                message: 'Id nhà xe không được bỏ trống!'
            })
        }
        const response = await ScheduleService.getAllByBusOwner(ownerId)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateSchedule = async (req, res) => {
    try {
        const scheduleId = req.params.id
        let { busOwnerId, busId, driverId, departureTime, ticketPrice, availableSeats, paymentRequire, prebooking, timeAlowCancel, scheduleType, inforSchedule } = req.body
        if (!busOwnerId || !busId || !driverId || !departureTime || !ticketPrice || !timeAlowCancel || !scheduleType) {
            return res.status(400).json({
                message: 'Thông tin nhập vào chưa đủ !'
            })
        }
        const response = await ScheduleService.updateSchedule(scheduleId, { busOwnerId, busId, driverId, departureTime, ticketPrice, availableSeats, paymentRequire, prebooking, timeAlowCancel, scheduleType, inforSchedule })
        return res.status(response.status).json(response)

    } catch (e) {
        console.log(e);
        return res.status(404).json({
            message: e
        })
    }
}

const deleteSchedule = async (req, res) => {
    try {
        const scheduleId = req.params.id
        if (!scheduleId) {
            return res.status(404).json({
                message: 'Id lịch trình không được bỏ trống !'
            })
        }
        const response = await ScheduleService.deleteSchedule(scheduleId)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

///
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





module.exports = {
    createSchedule,
    getAllByBusOwner,
    deleteSchedule,
    updateSchedule,
    getTripsBySearch,
    getTripsByFilter,
    getAllByDriver,
    getRunningByDriver,
    updateFinishTrip
}
