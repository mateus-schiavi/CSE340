// models/accountModel.js

const pool = require("../database/");

async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = `
      INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
        const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
        return result.rows[0];
    } catch (error) {
        throw new Error("Erro ao registrar conta: " + error.message);
    }
}

async function getAccountByEmail(account_email) {
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1;";
        const result = await pool.query(sql, [account_email]);
        return result.rows[0];
    } catch (error) {
        throw new Error("Erro ao buscar conta por e-mail: " + error.message);
    }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

module.exports = {
    registerAccount,
    getAccountByEmail
};
