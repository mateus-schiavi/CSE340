const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

// Login
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Register
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Management page (protected)
router.get(
  "/",
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
);

// Logout routes (POST e GET)
router.post(
  "/logout",
  utilities.handleErrors((req, res) => {
    res.clearCookie("jwt");
    req.flash("notice", "You have been logged out.");
    res.redirect("/");
  })
);

router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Manage account page
router.get("/manage", utilities.checkLogin, (req, res) => {
  res.render("account/manage", {
    title: "Manage Account",
    accountData: res.locals.accountData,
  });
});

// Edit account info - GET form
router.get(
  "/edit",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildEditView)
);

// Edit account info - POST form with validation
router.post(
  "/edit",
  utilities.checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccountInfo)
);

// Edit account password - POST form with validation
router.post(
  "/edit-password",
  utilities.checkLogin,
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updateAccountPassword)
);

module.exports = router;
