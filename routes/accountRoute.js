const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.post("/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin))

router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.post("/register", utilities.handleErrors(accountController.registerAccount))

// Rota para a página de gerenciamento da conta (proteção com checkLogin)
router.get(
    "/",
    utilities.checkJWTToken,
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildManagement)
)

module.exports = router
