// models/cart-model.js
const db = require('../database'); // importa o módulo que exporta query()


async function getCartByAccountId(account_id) {
  const sql = `
    SELECT c.car_id, i.inv_make, i.inv_model, i.inv_year, i.inv_description, i.inv_image, i.inv_thumbnail, i.inv_price, i.inv_miles, i.inv_color, i.classification_id
    FROM carts c
    JOIN inventory i ON c.car_id = i.inv_id
    WHERE c.account_id = $1
  `
  const values = [account_id]
  const result = await db.query(sql, values)
  return result.rows
}


// Adiciona carro no carrinho
async function addCarToCart(account_id, car_id) {
  // Você pode fazer uma lógica para incrementar quantidade ou inserir novo item
  const sql = `
    INSERT INTO carts (account_id, car_id)
    VALUES ($1, $2)
    ON CONFLICT (account_id, car_id)
    DO NOTHING
  `
  const values = [account_id, car_id]
  await db.query(sql, values)
}

module.exports = {
  getCartByAccountId,
  addCarToCart,
}
