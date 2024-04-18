const express = require("express");
const router = express.Router()
const PlaceController = require('../controllers/PlaceController');


router.get('/add', PlaceController.addPlace)



module.exports = router