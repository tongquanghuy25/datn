const express = require("express");
const router = express.Router()
const userController = require('../controllers/UserController');
// const PlaceController = require('../controllers/PlaceController');
const uploadCloud = require('../middleware/uploader')
const { authAdminMiddleWare, authUserMiddleWare, authBusOwnerMiddleWare } = require("../middleware/authMiddleware");

router.post('/sign-up', userController.createUser)
router.post('/sign-in', userController.loginUser)
router.post('/log-out', userController.logoutUser)
router.put('/update-user/:id', uploadCloud.single('avatar'), authUserMiddleWare, userController.updateUser)
router.put('/change-password/:id', authUserMiddleWare, userController.changePassword)
router.put('/reset-password', userController.resetPassword)
router.put('/edit-user/:id', authAdminMiddleWare, userController.editUser)
router.delete('/delete-user/:id', authAdminMiddleWare, userController.deleteUser)
router.get('/getAll', authAdminMiddleWare, userController.getAllUser)
router.get('/get-details/:id', authUserMiddleWare, userController.getDetailsUser)
router.post('/refresh-token', userController.refreshToken)

router.post('/sent-mail-admin', authBusOwnerMiddleWare, userController.sentMailAdmin)
router.get('/data-admin', authAdminMiddleWare, userController.getDataAdmin)

module.exports = router