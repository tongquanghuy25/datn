const express = require("express");
const router = express.Router()
const ReviewController = require('../controllers/ReviewController');
const { authBusOwnerMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");

router.post('/create', authUserMiddleWare, ReviewController.createReview)
router.get('/get-reviews-by-busowner/:id', ReviewController.getReviewsByBusOwner)



// router.put('/update/:id', uploadCloud.any(), authBusOwnerMiddleWare, BusController.updateBus)
// router.delete('/delete/:id', authBusOwnerMiddleWare, BusController.deleteBus)


module.exports = router