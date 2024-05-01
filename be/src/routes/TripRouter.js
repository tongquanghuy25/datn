const express = require("express");
const router = express.Router()
const TripController = require('../controllers/TripController');
const { authBusOwnerMiddleWare } = require("../middleware/authMiddleware");

router.post('/create', authBusOwnerMiddleWare, TripController.createTrip)
router.get('/get-all-by-bus-owner/:id', authBusOwnerMiddleWare, TripController.getAllByBusOwner)
router.delete('/delete/:id', authBusOwnerMiddleWare, TripController.deleteTrip)
router.put('/update/:id', authBusOwnerMiddleWare, TripController.updateTrip)
router.get('/get-trips-by-search', TripController.getTripsBySearch)
router.get('/get-trips-by-filter', TripController.getTripsByFilter)

// router.put('/update/:id', uploadCloud.any(), authBusOwnerMiddleWare, BusController.updateBus)
// router.delete('/delete/:id', authBusOwnerMiddleWare, BusController.deleteBus)

module.exports = router