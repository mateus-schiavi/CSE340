// utilities/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack)

  res.status(500).render("error", {
    title: "Server Error",
    message: err.message,
    error: err, // importante para mostrar o stack trace
  })
}

module.exports = errorHandler
