const express = require("express");
const router = express.Router()
const ReportController = require('../controllers/ReportController');
const { authBusOwnerMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");

router.post('/create', ReportController.createReport)
router.get('/get-all', ReportController.getAll)




// router.put('/update/:id', uploadCloud.any(), authBusOwnerMiddleWare, BusController.updateBus)
// router.delete('/delete/:id', authBusOwnerMiddleWare, BusController.deleteBus)


module.exports = router