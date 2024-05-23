const express = require("express");
const router = express.Router()
const DiscountController = require('../controllers/DiscountController');
const { authAdminMiddleWare } = require("../middleware/authMiddleware");

router.post('/create', authAdminMiddleWare, DiscountController.createDiscount)
router.get('/check', DiscountController.checkDiscount)
router.get('/get-by-bus-owner/:id', authAdminMiddleWare, DiscountController.getByBusOwner)
router.delete('/delete/:id', authAdminMiddleWare, DiscountController.deleteDiscount)


// router.get('/get-by-bus-owner', authAdminMiddleWare, DiscountController.getByBusOwner)

// router.get('/get-bus-by-busowner/:id', authBusOwnerMiddleWare, BusController.getBussByBusOwner)
// router.put('/update/:id', uploadCloud.any(), authBusOwnerMiddleWare, BusController.updateBus)
// router.delete('/delete/:id', authBusOwnerMiddleWare, BusController.deleteBus)


module.exports = router