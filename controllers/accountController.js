const utilities = require("../utilities");
const accountModel = require("../models/account-model");

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    message: req.flash()
  });
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    message: req.flash()
  });
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();

  // Validate request body exists
  if (!req.body) {
    req.flash("error", "Invalid form submission");
    return res.status(400).render("account/register", {
      title: "Register",
      nav,
      errors: null,
      message: req.flash()
    });
  }

  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password
  } = req.body;

  // Validate required fields
  if (!account_firstname || !account_lastname || !account_email || !account_password) {
    req.flash("error", "All fields are required");
    return res.status(400).render("account/register", {
      title: "Register",
      nav,
      errors: null,
      message: req.flash()
    });
  }

  try {
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    );

    if (regResult.rowCount > 0) {
      req.flash(
        "success",
        `Congratulations, ${account_firstname}! You're now registered. Please log in.`
      );
      return res.redirect("/account/login");
    } else {
      req.flash("error", "Registration failed. Please try again.");
      return res.status(500).render("account/register", {
        title: "Register",
        nav,
        errors: null,
        message: req.flash()
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    req.flash("error", "An error occurred during registration");
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
      message: req.flash()
    });
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount
};