const express = require("express");
const router = express.Router()
const PlaceController = require('../controllers/PlaceController');


// router.get('/add', PlaceController.addPlace)
router.get('/get-all-province', PlaceController.getAllProvince)
router.get('/get-district-by-province/:id', PlaceController.getDistrictByProvince)




module.exports = router