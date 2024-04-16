const express = require("express");
const router = express.Router()
const DriverController = require('../controllers/DriverController');
const uploadCloud = require('../middleware/uploader')
const { authBusOwnerMiddleWare } = require("../middleware/authMiddleware");

router.post('/register', uploadCloud.single('avatar'), authBusOwnerMiddleWare, DriverController.createDriver)
router.get('/get-driver-by-busowner/:id', authBusOwnerMiddleWare, DriverController.getDriversByBusOwner)
router.delete('/delete/:id', authBusOwnerMiddleWare, DriverController.deleteDriver)

// router.get('/get-all', authAdminMiddleWare, busOwnerController.getAllBusOwner)
// router.put('/edit/:id', authAdminMiddleWare, busOwnerController.editBusOwner)
// router.get('/get-all-not-accept', authAdminMiddleWare, busOwnerController.getAllBusOwnerNotAccept)

module.exports = router