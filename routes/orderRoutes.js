const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const utilities = require("../utilities");

router.get("/checkout", utilities.checkLogin, orderController.buildCheckout);
router.post("/checkout", utilities.checkLogin, orderController.processCheckout);

module.exports = router;
