const express = require("express");
const router = express.Router()
const TripController = require('../controllers/TripController');
const { authBusOwnerMiddleWare, authDriverMiddleWare } = require("../middleware/authMiddleware");

router.post('/create', authBusOwnerMiddleWare, TripController.createTrip)
router.get('/get-all-by-bus-owner/:id', authBusOwnerMiddleWare, TripController.getAllByBusOwner)
router.delete('/delete/:id', authBusOwnerMiddleWare, TripController.deleteTrip)
router.put('/update/:id', authDriverMiddleWare, TripController.updateTrip)
router.get('/get-trips-by-search', TripController.getTripsBySearch)
router.get('/get-trips-by-filter', TripController.getTripsByFilter)
router.get('/get-all-by-driver/:id', authDriverMiddleWare, TripController.getAllByDriver)
router.get('/get-running-by-driver/:id', authDriverMiddleWare, TripController.getRunningByDriver)
router.put('/update-finish-trip/:id', authDriverMiddleWare, TripController.updateFinishTrip)

module.exports = router