const express = require("express");
const router = express.Router()
const DriverController = require('../controllers/DriverController');
const uploadCloud = require('../middleware/uploader')
const { authBusOwnerMiddleWare } = require("../middleware/authMiddleware");

router.post('/register', uploadCloud.single('avatar'), authBusOwnerMiddleWare, DriverController.createDriver)
router.get('/get-driver-by-busowner/:id', authBusOwnerMiddleWare, DriverController.getDriversByBusOwner)
router.delete('/delete/:id', authBusOwnerMiddleWare, DriverController.deleteDriver)

module.exports = router