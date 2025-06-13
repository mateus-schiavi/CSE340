// controllers/accountController.js

const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
 *  Deliver account management view
 * *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav();
  const accountData = req.accountData;

  res.render("account/account-management", {
    title: "Account Management",
    nav,
    message: req.flash(),
    account_firstname: accountData.account_firstname,
    account_type: accountData.account_type,
    account_id: accountData.account_id,
  });
}


/* ****************************************
 *  Process registration
 * *************************************** */
async function registerAccount(req, res) {
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    const existingUser = await accountModel.getAccountByEmail(account_email);
    if (existingUser) {
      req.flash("notice", "E-mail already registered. Please log in or use another e-mail.");
      return res.status(400).render("account/register", {
        title: "Register",
        nav: await utilities.getNav(),
        errors: null,
        message: req.flash(),
        account_firstname,
        account_lastname,
        account_email,
      });
    }

    const hashedPassword = await bcrypt.hash(account_password, 10);

    const result = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (result) {
      req.flash("notice", "Account successfully created. Please log in.");
      return res.redirect("/account/login");
    } else {
      req.flash("notice", "Error creating account. Please try again.");
      return res.status(500).render("account/register", {
        title: "Register",
        nav: await utilities.getNav(),
        errors: null,
        message: req.flash(),
        account_firstname,
        account_lastname,
        account_email,
      });
    }
  } catch (error) {
    console.error("Error in registration:", error);
    req.flash("notice", "Internal error. Please try again later.");
    return res.status(500).render("account/register", {
      title: "Register",
      nav: await utilities.getNav(),
      errors: null,
      message: req.flash(),
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

/* ****************************************
 *  Process login request
 * *************************************** */
async function accountLogin(req, res, next) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  try {
    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 3600 * 1000,
      });
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Deliver Edit Account View
 * *************************************** */
async function buildEditView(req, res, next) {
  try {
    const accountData = await accountModel.getAccountById(req.accountData.account_id);

    res.render("account/edit", {
      title: "Edit Account Information",
      accountData,
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Process Account Information Update
 * *************************************** */
async function updateAccountInfo(req, res, next) {
  try {
    const { account_firstname, account_lastname, account_email } = req.body;
    const account_id = req.accountData.account_id;

    // If changing email, check if the new email already exists
    const existingUser = await accountModel.getAccountByEmail(account_email);
    if (existingUser && existingUser.account_id != account_id) {
      req.flash("notice", "Email already in use. Please use a different email.");
      return res.redirect("/account/edit");
    }

    await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email);

    const updatedAccountData = await accountModel.getAccountById(account_id);

    req.flash("notice", "Account information updated successfully.");
    res.render("account/account-management", {
      title: "Account Management",
      nav: await utilities.getNav(),
      message: req.flash(),
      account_firstname: updatedAccountData.account_firstname,
      account_type: updatedAccountData.account_type,
      account_id: updatedAccountData.account_id
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Process Password Change
 * *************************************** */
async function updateAccountPassword(req, res, next) {
  try {
    const { account_password, account_password_confirm } = req.body;
    const account_id = req.accountData.account_id;

    if (account_password !== account_password_confirm) {
      req.flash("notice", "Passwords do not match.");
      return res.redirect("/account/edit");
    }

    if (account_password.length < 8) {
      req.flash("notice", "Password must be at least 8 characters.");
      return res.redirect("/account/edit");
    }

    const hashedPassword = await bcrypt.hash(account_password, 10);

    await accountModel.updateAccountPassword(account_id, hashedPassword);

    req.flash("notice", "Password updated successfully.");
    res.redirect("/account/manage");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  buildManagement,
  registerAccount,
  accountLogin,
  buildEditView,
  updateAccountInfo,
  updateAccountPassword
};
