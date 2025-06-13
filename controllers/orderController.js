const cartModel = require('../models/cart-model');
const orderModel = require('../models/order-model');

async function buildCheckout(req, res, next) {
    const accountId = req.accountData.account_id;
    const cartItems = await cartModel.getCartByAccountId(accountId);
    const nav = await require("../utilities").getNav();

    if (cartItems.length === 0) {
        req.flash("notice", "Your cart is empty.");
        return res.redirect("/account");
    }

    res.render("order/checkout", {
        title: "Checkout",
        nav,
        cartItems
    });
}

async function processCheckout(req, res, next) {
    const accountId = req.accountData.account_id;
    const { delivery_address, receiver_name } = req.body;

    const cartItems = await cartModel.getCartByAccountId(accountId);

    if (cartItems.length === 0) {
        req.flash("notice", "Your cart is empty.");
        return res.redirect("/account");
    }

    try {
        await orderModel.createOrder(accountId, delivery_address, receiver_name, cartItems);
        await cartModel.clearCart(accountId);

        req.flash("success", "Thank you for your purchase! Your car is on its way 🚗💨");
        res.redirect("/account");
    } catch (error) {
        next(error);
    }
}

module.exports = {
    buildCheckout,
    processCheckout
};
