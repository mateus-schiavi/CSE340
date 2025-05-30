const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
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


module.exports = {
  buildLogin,
  buildRegister,
  registerAccount
};