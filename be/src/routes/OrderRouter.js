const express = require("express");
const router = express.Router()
const OrderController = require('../controllers/OrderController');
const { authUserMiddleWare, authAdminMiddleWare, authDriverMiddleWare, authBusOwnerMiddleWare } = require("../middleware/authMiddleware");

router.post('/create-ticket', OrderController.createTicketOrder)
router.get('/get-seats-booked-by-trip/:id', OrderController.getSeatsBookedByTrip)
router.put('/update-status-ticket/:id', authDriverMiddleWare, OrderController.updateStatusTicketOrder)
router.get('/get-ticket-order-by-trip/:id', authBusOwnerMiddleWare, OrderController.getTicketOrderByTrip)


//GOODS
router.post('/create-goods', authBusOwnerMiddleWare, OrderController.createGoodsOrder)
router.put('/update-goods/:id', authBusOwnerMiddleWare, OrderController.updateGoodsOrder)
router.delete('/delete-goods/:id', authBusOwnerMiddleWare, OrderController.deleteGoodsOrder)
router.get('/get-goods-order-by-trip/:id', authBusOwnerMiddleWare, OrderController.getGoodsOrderByTrip)
router.put('/update-status-goods/:id', authDriverMiddleWare, OrderController.updateStatusGoodsOrder)




// router.get('/get-details-order/:id', OrderController.getDetailsOrder)
// router.delete('/cancel-order/:id', authUserMiddleWare, OrderController.cancelOrderDetails)
// router.get('/get-all-order', authAdminMiddleWare, OrderController.getAllOrder)


module.exports = router