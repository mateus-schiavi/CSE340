// /* ******************************************
//  * This server.js file is the primary file of the 
//  * application. It is used to control the project.
//  *******************************************/
// /* ***********************
//  * Require Statements
//  *************************/
// const cookieParser = require('cookie-parser')
// const session = require("express-session")
// const pool = require('./database/')
// const express = require("express")
// const env = require("dotenv").config()
// const app = express()
// const static = require("./routes/static")
// const expressLayouts = require("express-ejs-layouts")
// const baseController = require("./controllers/baseController")
// const inventoryRoute = require("./routes/inventoryRoute")
// const utilities = require("./utilities")
// const accountRoute = require('./routes/accountRoute');
// const bodyParser = require("body-parser")
// const path = require('path');
// const cartRoute = require("./routes/cartRoute")
// /* ***********************
//  * Middleware
//  ************************/
// app.use(cookieParser())
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({
//   store: new (require('connect-pg-simple')(session))({
//     createTableIfMissing: true,
//     pool,
//   }),
//   secret: process.env.SESSION_SECRET,
//   resave: true,
//   saveUninitialized: true,
//   name: 'sessionId',
// }))

// app.use(utilities.checkJWTToken)

// app.use(require('connect-flash')())
// app.use(function (req, res, next) {
//   res.locals.messages = require('express-messages')(req, res)
//   next()
// })

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))

// app.use(session({
//   store: new (require('connect-pg-simple')(session))({
//     createTableIfMissing: true,
//     pool,
//   }),
//   secret: process.env.SESSION_SECRET,
//   resave: true,
//   saveUninitialized: true,
//   name: 'sessionId',
// }))

// // Flash messages
// app.use(require('connect-flash')())
// app.use(function (req, res, next) {
//   res.locals.messages = require('express-messages')(req, res)
//   next()
// })

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))

// app.use("/account", accountRoute)
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use("/cart", cartRoute);
// /* ***********************
//  * View Engines and Templates
//  *************************/
// app.set("view engine", "ejs")
// app.use(expressLayouts)
// app.set("layout", "./layouts/layout")
// /* ***********************
//  * Routes
//  *************************/

// app.use(static)

// // Index Route
// app.get("/", utilities.handleErrors(baseController.buildHome))
// app.use("/inv", inventoryRoute)

// app.get("/cause-error", (req, res, next) => {
//   next(new Error("Middleware Test Error"))
// })


// // Middleware para tratar erros 404 (rota não encontrada)
// app.use((req, res, next) => {
//   const err = new Error("Page Not Found")
//   err.status = 404
//   next(err)
// })

// // Middleware

// app.use(async (err, req, res, next) => {
//   let nav = await utilities.getNav()
//   console.error(`Error at: "${req.originalUrl}": ${err.message}`)

//   let message
//   if (err.status == 404) {
//     message = err.message
//   } else {
//     message = 'Oh no! There was a crash. Maybe try a different route?'
//   }

//   res.status(err.status || 500).render("errors/error", {
//     title: err.status || 'Server Error',
//     message,
//     error: process.env.NODE_ENV === "development" ? err : {},  // << aqui!
//     nav
//   })
// })

// /* ***********************
//  * Local Server Information
//  * Values from .env (environment) file
//  *************************/
// const port = process.env.PORT
// const host = process.env.HOST

// /* ***********************
//  * Log statement to confirm server operation
//  *************************/
// app.listen(port, () => {
//   console.log(`app listening on ${host}:${port}`)
// })
/******************************************
 * Server.js
 ******************************************/

/* =======================
 * Require Statements
 ========================= */
const express = require("express")
const app = express()
const path = require('path');
const env = require("dotenv").config()
const session = require("express-session")
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser")
const expressLayouts = require("express-ejs-layouts")
const pool = require('./database/')
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const cartRoute = require("./routes/cartRoute")
const utilities = require("./utilities")
const orderRoute = require("./routes/orderRoutes");
/* =======================
 * Middleware
 ========================= */
// Static Files
app.use(express.static(path.join(__dirname, 'public')))

// Cookies
app.use(cookieParser())

// Sessions
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'sessionId',
}))

// Flash Messages
app.use(require('connect-flash')())
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// JWT Middleware
app.use(utilities.checkJWTToken)
// Body Parsers
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/* =======================
 * View Engine
 ========================= */
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* =======================
 * Routes
 ========================= */
app.use("/", static)
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)
app.use("/cart", cartRoute)
app.use("/order", orderRoute);
// Home
app.get("/", utilities.handleErrors(baseController.buildHome))

// Test Error
app.get("/cause-error", (req, res, next) => {
  next(new Error("Middleware Test Error"))
})

/* =======================
 * Error Handling
 ========================= */
// 404
app.use((req, res, next) => {
  const err = new Error("Page Not Found")
  err.status = 404
  next(err)
})

// 500
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav()
  console.error(`Error at "${req.originalUrl}": ${err.message}`)

  const message = err.status == 404
    ? err.message
    : "Oh no! There was a crash. Maybe try a different route?"

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    error: process.env.NODE_ENV === "development" ? err : {},
    nav,
  })
})

/* =======================
 * Server Startup
 ========================= */
const port = process.env.PORT
const host = process.env.HOST

app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`)
})
