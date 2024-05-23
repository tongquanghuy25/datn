const express = require("express");
const router = express.Router()
const ScheduleController = require('../controllers/ScheduleController');
const { authBusOwnerMiddleWare, authDriverMiddleWare } = require("../middleware/authMiddleware");

router.post('/create', authBusOwnerMiddleWare, ScheduleController.createSchedule)
router.get('/get-all-by-bus-owner/:id', authBusOwnerMiddleWare, ScheduleController.getAllByBusOwner)
router.put('/update/:id', authDriverMiddleWare, ScheduleController.updateSchedule)
router.delete('/delete/:id', authBusOwnerMiddleWare, ScheduleController.deleteSchedule)

// router.get('/get-trips-by-search', TripController.getTripsBySearch)
// router.get('/get-trips-by-filter', TripController.getTripsByFilter)
// router.get('/get-all-by-driver/:id', authDriverMiddleWare, TripController.getAllByDriver)
// router.get('/get-running-by-driver/:id', authDriverMiddleWare, TripController.getRunningByDriver)
// router.put('/update-finish-trip/:id', authDriverMiddleWare, TripController.updateFinishTrip)

module.exports = router