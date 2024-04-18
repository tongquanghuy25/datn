const express = require("express");
const router = express.Router()
const busOwnerController = require('../controllers/BusOwnerController');
const { authAdminMiddleWare, authUserMiddleWare, authBusOwnerMiddleWare } = require("../middleware/authMiddleware");

router.post('/register', authUserMiddleWare, busOwnerController.createBusOwner)
router.get('/get-all', authAdminMiddleWare, busOwnerController.getAllBusOwner)
router.put('/edit/:id', authAdminMiddleWare, busOwnerController.editBusOwner)
router.delete('/delete/:id', authAdminMiddleWare, busOwnerController.deleteBusOwner)
router.get('/get-all-not-accept', authAdminMiddleWare, busOwnerController.getAllBusOwnerNotAccept)
router.get('/get-detail-by-userId/:id', authBusOwnerMiddleWare, busOwnerController.getDetailBusOwnerByUserId)

// router.post('/sign-in', userController.loginUser)
// router.post('/log-out', userController.logoutUser)
// router.put('/update-user/:id', authUserMiddleWare, userController.updateUser)
// router.put('/edit-user/:id', authAdminMiddleWare, userController.editUser)
// router.delete('/delete-user/:id', authAdminMiddleWare, userController.deleteUser)
// router.get('/getAll', authAdminMiddleWare, userController.getAllUser)
// router.post('/refresh-token', userController.refreshToken)
// router.post('/delete-many', authAdminMiddleWare, userController.deleteMany)

module.exports = router