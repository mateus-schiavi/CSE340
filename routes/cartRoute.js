const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const utilities = require("../utilities");

router.post("/add/:inv_id", utilities.checkLogin, cartController.addToCart);
router.post("/remove/:inv_id", utilities.checkLogin, cartController.removeFromCart);

module.exports = router;
