const express = require("express");
const router = express.Router()
const OrderController = require('../controllers/OrderController');
const { authUserMiddleWare, authAdminMiddleWare, authDriverMiddleWare } = require("../middleware/authMiddleware");

router.post('/create', OrderController.createTicketOrder)
router.get('/get-seats-booked-by-trip/:id', OrderController.getSeatsBookedByTrip)
router.put('/update-status/:id', authDriverMiddleWare, OrderController.updateStatusTicketOrder)
// router.get('/get-details-order/:id', OrderController.getDetailsOrder)
// router.delete('/cancel-order/:id', authUserMiddleWare, OrderController.cancelOrderDetails)
// router.get('/get-all-order', authAdminMiddleWare, OrderController.getAllOrder)


module.exports = router