// models/cart-model.js
const db = require('../database');


async function getCartByAccountId(account_id) {
  const sql = `
    SELECT c.car_id, c.quantity, i.inv_make, i.inv_model, i.inv_year, i.inv_description, i.inv_image, i.inv_thumbnail, i.inv_price, i.inv_miles, i.inv_color, i.classification_id
    FROM carts c
    JOIN inventory i ON c.car_id = i.inv_id
    WHERE c.account_id = $1
  `
  const values = [account_id]
  const result = await db.query(sql, values)
  return result.rows
}

async function addCarToCart(account_id, car_id) {
  const sql = `
    INSERT INTO carts (account_id, car_id, quantity)
    VALUES ($1, $2, 1)
    ON CONFLICT (account_id, car_id)
    DO UPDATE SET quantity = carts.quantity + 1
  `
  const values = [account_id, car_id]
  await db.query(sql, values)
}

async function removeCarFromCart(account_id, car_id) {

  const selectSql = `SELECT quantity FROM carts WHERE account_id = $1 AND car_id = $2`
  const selectResult = await db.query(selectSql, [account_id, car_id])

  if (selectResult.rows.length === 0) return;

  const currentQuantity = selectResult.rows[0].quantity;

  if (currentQuantity > 1) {
    const updateSql = `
      UPDATE carts SET quantity = quantity - 1
      WHERE account_id = $1 AND car_id = $2
    `
    await db.query(updateSql, [account_id, car_id])
  } else {
    const deleteSql = `
      DELETE FROM carts WHERE account_id = $1 AND car_id = $2
    `
    await db.query(deleteSql, [account_id, car_id])
  }
}

async function clearCart(account_id) {
  const sql = `DELETE FROM carts WHERE account_id = $1`;
  await db.query(sql, [account_id]);
}



module.exports = {
  getCartByAccountId,
  addCarToCart,
  removeCarFromCart,
  clearCart,
}
