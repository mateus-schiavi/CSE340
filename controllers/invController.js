const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  try {
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();
    const className = data[0].classification_name;

    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    next(error); // envia para o middleware de erro
  }
};

invCont.buildDetailView = async function (req, res, next) {
  const inv_id = req.params.inv_id;

  try {
    const data = await invModel.getInventoryById(inv_id);
    if (!data) {
      res.status(404).render("errors/404", { title: "Vehicle Not Found" });
    }
    const detailHTML = await utilities.buildDetailHTML(data);
    const nav = await utilities.getNav();

    res.render("./inventory/details", {
      title: `${data.inv_make} ${data.inv_model}`,
      nav,
      detailHTML,
    });
  } catch (error) {
    next(error);
  }
}

invCont.throwError = (req, res, next) => {
  try {
    throw new Error("Intentional server error triggered for testing")
  } catch (error) {
    next(error)
  }
}


module.exports = invCont