const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildDetailView = async function (req, res, next) {
  const invId = req.params.invId
  const vehicleData = await invModel.getVehicleById(invId)
  const detailHtml = await utilities.buildDetailView(vehicleData)
  const nav = await utilities.getNav()
  const title = `${vehicleData.inv_make} ${vehicleData.inv_model}`

  res.render("./inventory/detail", {
    title,
    nav,
    detailHtml,
  })
}


module.exports = invCont