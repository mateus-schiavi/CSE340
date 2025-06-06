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
  const accountData = req.accountData; // aqui vem do middleware

  res.render("account/account-management", {
    title: "Account Management",
    nav,
    message: req.flash(),
    account_firstname: accountData ? accountData.account_firstname : null,
  });
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    const existingUser = await accountModel.getAccountByEmail(account_email);
    if (existingUser) {
      req.flash("notice", "E-mail já registrado. Faça login ou use outro e-mail.");
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
      req.flash("notice", "Conta criada com sucesso. Faça login.");
      return res.redirect("/account/login");
    } else {
      req.flash("notice", "Erro ao criar conta. Tente novamente.");
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
    console.error("Erro no registro:", error);
    req.flash("notice", "Erro interno. Tente novamente mais tarde.");
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
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
      }
      return res.redirect("/account/");
    } else {
      req.flash("message notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error('Access Forbidden');
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  buildManagement,
  registerAccount,
  accountLogin
};
