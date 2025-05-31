const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error: " + error)
  }
}

/* ***************************
 *  Get inventory item by inventory ID
 * ************************** */
async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id
       WHERE i.inv_id = $1`,
      [inv_id]
    );
    return data.rows[0];  // retorna um único veículo
  } catch (error) {
    console.error("getInventoryById error: " + error);
  }
}

/* ***************************
 *  Insert a new classification
 * ************************** */
async function insertClassification(classification_name) {
  try {
    const sql = 'INSERT INTO public.classification (classification_name) VALUES ($1)';
    const result = await pool.query(sql, [classification_name]);
    return result.rowCount; // retorna número de linhas inseridas
  } catch (error) {
    console.error("insertClassification error: " + error);
  }
}

/* ***************************
 *  Insert a new inventory item
 * ************************** */
async function insertInventory(inv) {
  try {
    const sql = `INSERT INTO public.inventory 
      (classification_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, inv_image, inv_thumbnail) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`;
    const values = [
      inv.classification_id,
      inv.inv_make,
      inv.inv_model,
      inv.inv_year,
      inv.inv_description,
      inv.inv_price,
      inv.inv_miles,
      inv.inv_color,
      inv.inv_image,
      inv.inv_thumbnail,
    ];
    const result = await pool.query(sql, values);
    return result.rowCount;
  } catch (error) {
    console.error("insertInventory error: " + error);
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  insertClassification,
  insertInventory,
}
