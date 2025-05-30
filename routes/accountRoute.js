const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")

// GET login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// POST login form (para implementação futura)
router.post("/login", 
    utilities.handleErrors(accountController.processLogin))

module.exports = router;