const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)

    if (!data || data.length === 0) {
      return res.status(404).render("inventory/notfound", { title: "No vehicles found" })
    }

    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name

    res.render("inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    next(error)
  }
}

invCont.buildDetailView = async function (req, res, next) {
  try {
    const invId = req.params.invId
    const vehicleData = await invModel.getVehicleById(invId)

    if (!vehicleData) {
      return res.status(404).render("inventory/notfound", { title: "Vehicle not found" })
    }

    const detailHtml = await utilities.buildDetailView(vehicleData)
    const nav = await utilities.getNav()
    const title = `${vehicleData.inv_make} ${vehicleData.inv_model}`

    res.render("inventory/details", {
      title,
      nav,
      detailHtml,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = invCont
