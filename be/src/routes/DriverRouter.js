const express = require("express");
const router = express.Router()
const DriverController = require('../controllers/DriverController');
const uploadCloud = require('../middleware/uploader')
const { authBusOwnerMiddleWare, authDriverMiddleWare } = require("../middleware/authMiddleware");

router.post('/register', uploadCloud.single('avatar'), authBusOwnerMiddleWare, DriverController.createDriver)
router.get('/get-driver-by-busowner/:id', authBusOwnerMiddleWare, DriverController.getDriversByBusOwner)
router.get('/get-detail-by-user-id/:id', authDriverMiddleWare, DriverController.getDriversByUserId)
router.delete('/delete/:id', authBusOwnerMiddleWare, DriverController.deleteDriver)

module.exports = router