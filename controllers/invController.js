const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const { validationResult } = require('express-validator');

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

invCont.managementView = (req, res) => {
  const message = req.flash('message');
  res.render('inventory/management', { message });
}

invCont.addClassificationView = (req, res) => {
  const errors = []
  const message = req.flash('message')
  res.render('inventory/add-classification', { errors, message })
}

invCont.addClassificationProcess = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.render('inventory/add-classification', {
      errors: errors.array(),
      message: null,
      classification_name: req.body.classification_name,
    });
  }

  try {
    const { classification_name } = req.body
    const result = await invModel.insertClassification(classification_name)

    if (result) {
      req.flash('message', `Classification "${classification_name}" added successfully.`)
      return res.redirect('/inv') // volta para a página de gerenciamento
    } else {
      res.render('inventory/add-classification', {
        errors: [{ msg: 'Failed to add classification.' }],
        message: null
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).render('inventory/add-classification', {
      errors: [{ msg: 'Server error.' }],
      message: null
    })
  }
}

module.exports = invCont