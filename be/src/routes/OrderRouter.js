const express = require("express");
const router = express.Router()
const OrderController = require('../controllers/OrderController');
const { authUserMiddleWare, authAdminMiddleWare, authDriverMiddleWare, authBusOwnerMiddleWare } = require("../middleware/authMiddleware");

router.post('/create-ticket', OrderController.createTicketOrder)
router.get('/get-seats-booked-by-trip/:id', OrderController.getSeatsBookedByTrip)
router.get('/get-tickets-by-user/:id', authUserMiddleWare, OrderController.getTicketsByUser)
router.delete('/delete-ticket/:id', authBusOwnerMiddleWare, OrderController.deleteTicketOrder)
router.put('/change-seat/:id', authBusOwnerMiddleWare, OrderController.changeSeat)
router.put('/delete-seat', authBusOwnerMiddleWare, OrderController.deleteSeat)
router.put('/update-ticket/:id', authDriverMiddleWare, OrderController.updateTicketOrder)
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