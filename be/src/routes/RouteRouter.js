const express = require("express");
const router = express.Router()
const RouteController = require('../controllers/RouteController');
const { authBusOwnerMiddleWare } = require("../middleware/authMiddleware");

router.post('/add-location', authBusOwnerMiddleWare, RouteController.addLocation)
router.post('/add-stop-point', authBusOwnerMiddleWare, RouteController.addStopPoint)
router.get('/get-stop-point-by-route/:id', authBusOwnerMiddleWare, RouteController.getStopPointsByBusRoute)
router.delete('/delete-stop-point/:id', authBusOwnerMiddleWare, RouteController.deleteStopPoint)
router.post('/create-route', authBusOwnerMiddleWare, RouteController.createRoute)
router.get('/get-route-by-busowner/:id', authBusOwnerMiddleWare, RouteController.getRoutesByBusOwner)
router.delete('/delete-route/:id', authBusOwnerMiddleWare, RouteController.deleteRoute)
router.put('/update-route/:id', authBusOwnerMiddleWare, RouteController.updateRoute)
router.get('/get-all-place/:province/:district', authBusOwnerMiddleWare, RouteController.getAllPlace)
router.get('/get-places-by-search-trip', RouteController.getPlacesBySearchTrip)



// router.post('/sign-in', userController.loginUser)
// router.post('/log-out', userController.logoutUser)
// router.put('/update-user/:id', uploadCloud.single('avatar'), authUserMiddleWare, userController.updateUser)
// router.put('/edit-user/:id', authAdminMiddleWare, userController.editUser)
// router.delete('/delete-user/:id', authAdminMiddleWare, userController.deleteUser)
// router.get('/getAll', authAdminMiddleWare, userController.getAllUser)
// router.get('/get-details/:id', authUserMiddleWare, userController.getDetailsUser)
// router.post('/refresh-token', userController.refreshToken)
// router.post('/delete-many', authAdminMiddleWare, userController.deleteMany)

module.exports = router