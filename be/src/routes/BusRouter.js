const express = require("express");
const router = express.Router()
const BusController = require('../controllers/BusController');
const uploadCloud = require('../middleware/uploader')
const { authBusOwnerMiddleWare } = require("../middleware/authMiddleware");

router.post('/register', uploadCloud.any(), authBusOwnerMiddleWare, BusController.createBus)
router.get('/get-bus-by-busowner/:id', authBusOwnerMiddleWare, BusController.getBussByBusOwner)
router.put('/update/:id', uploadCloud.any(), authBusOwnerMiddleWare, BusController.updateBus)
router.delete('/delete/:id', authBusOwnerMiddleWare, BusController.deleteBus)

// router.get('/get-all', authAdminMiddleWare, busOwnerController.getAllBusOwner)
// router.put('/edit/:id', authAdminMiddleWare, busOwnerController.editBusOwner)
// router.get('/get-all-not-accept', authAdminMiddleWare, busOwnerController.getAllBusOwnerNotAccept)

module.exports = router