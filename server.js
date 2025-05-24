/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const expressLayouts = require("express-ejs-layouts")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")


/* ***********************
 * View Engines and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")
/* ***********************
 * Routes
 *************************/

app.use(static)

// Index Route
app.get("/", baseController.buildHome)
app.use("/inv", inventoryRoute)

// Middleware para tratar erros 404 (rota não encontrada)
app.use((req, res, next) => {
  const err = new Error("Page Not Found")
  err.status = 404
  next(err)
})

// Middleware

app.use(async (err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || "Internal Server Error"

  const utilities = require("./utilities")
  const nav = await utilities.getNav()

  res.status(status).render("errors/error", {
    title: `Error ${status}`,
    message,
    error: process.env.NODE_ENV === "development" ? err : {}, 
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
