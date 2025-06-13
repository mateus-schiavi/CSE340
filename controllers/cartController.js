const cartModel = require('../models/cart-model');

async function addToCart(req, res, next) {
  try {
    const accountId = req.accountData.account_id;
    const carId = parseInt(req.params.inv_id);

    await cartModel.addCarToCart(accountId, carId);

    req.flash("notice", "Car added to your cart!");
    res.redirect("/account");
  } catch (error) {
    next(error);
  }
}

async function removeFromCart(req, res, next) {
  try {
    const accountId = req.accountData.account_id;
    const carId = parseInt(req.params.inv_id);

    await cartModel.removeCarFromCart(accountId, carId);

    req.flash("notice", "Car removed from your cart.");
    res.redirect("/account");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addToCart,
  removeFromCart
}
