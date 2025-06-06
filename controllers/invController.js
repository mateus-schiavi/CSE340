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
    next(error);
  }
};

invCont.buildDetailView = async function (req, res, next) {
  const inv_id = req.params.inv_id;

  try {
    const data = await invModel.getInventoryById(inv_id);
    if (!data) {
      const nav = await utilities.getNav();
      return res.status(404).render("errors/404", { title: "Vehicle Not Found", nav });
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

invCont.throwError = async (req, res, next) => {
  try {
    throw new Error("Intentional server error triggered for testing");
  } catch (error) {
    next(error);
  }
}

invCont.managementView = async (req, res) => {
  const message = req.flash('message');
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render('inventory/management',
    {
      title: 'Inventory Management',
      message,
      nav,
      classificationSelect
    });
}

invCont.addClassificationView = async (req, res) => {
  const errors = [];
  const message = req.flash('message');
  const nav = await utilities.getNav();
  res.render('inventory/add-classification', { title: 'Add Classification', errors, message, nav });
}

invCont.addClassificationProcess = async (req, res) => {
  const errors = validationResult(req);
  const nav = await utilities.getNav();

  if (!errors.isEmpty()) {
    return res.render('inventory/add-classification', {
      title: 'Add Classification',
      errors: errors.array(),
      message: null,
      classification_name: req.body.classification_name,
      nav
    });
  }

  try {
    const { classification_name } = req.body;
    const result = await invModel.insertClassification(classification_name);

    if (result) {
      req.flash('message', `Classification "${classification_name}" added successfully.`);
      return res.redirect('/inv');
    } else {
      res.render('inventory/add-classification', {
        title: 'Add Classification',
        errors: [{ msg: 'Failed to add classification.' }],
        message: null,
        nav
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).render('inventory/add-classification', {
      title: 'Add Classification',
      errors: [{ msg: 'Server error.' }],
      message: null,
      nav
    });
  }
}

invCont.addInventoryView = async (req, res, next) => {
  try {
    const message = req.flash('message');
    const errors = [];
    const classificationList = await utilities.buildClassificationList();
    const nav = await utilities.getNav();
    res.render('inventory/add-inventory', {
      title: 'Add Inventory',
      message,
      errors,
      classificationList,
      nav,
      inv_make: '',
      inv_model: '',
      inv_year: '',
      inv_description: '',
      inv_price: '',
      inv_miles: '',
      inv_color: '',
      inv_image: '/images/no-image-available.png',
      inv_thumbnail: '/images/no-image-available.png',
    });
  } catch (error) {
    console.error('Error in addInventoryView:', error);
    next(error);
  }
};

invCont.addInventoryProcess = async (req, res) => {
  const errors = validationResult(req);
  const classificationList = await utilities.buildClassificationList(req.body.classification_id);
  const nav = await utilities.getNav();

  if (!errors.isEmpty()) {
    return res.render('inventory/add-inventory', {
      title: 'Add Inventory',
      message: null,
      errors: errors.array(),
      classificationList,
      nav,
      ...req.body
    });
  }

  try {
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
      inv_image = '/images/no-image-available.png',
      inv_thumbnail = '/images/no-image-available.png',
    } = req.body;

    const result = await invModel.insertInventory({
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
      inv_image,
      inv_thumbnail
    });

    if (result) {
      req.flash('message', `${inv_make} ${inv_model} added successfully to the inventory.`);
      return res.redirect('/inv');
    } else {
      res.render('inventory/add-inventory', {
        title: 'Add Inventory',
        message: null,
        errors: [{ msg: 'Failed to add inventory item.' }],
        classificationList,
        nav,
        ...req.body
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).render('inventory/add-inventory', {
      title: 'Add Inventory',
      message: null,
      errors: [{ msg: 'Server error.' }],
      classificationList,
      nav,
      ...req.body
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    const itemData = await invModel.getInventoryById(inv_id);
    if (!itemData) {
      // Caso não encontre o inventário, pode redirecionar ou mostrar erro
      return res.status(404).render('error', { title: 'Inventory Not Found', message: 'Inventory item not found.' });
    }
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      message: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id,
    });
  } catch (error) {
    return next(error);
  }
}

invCont.deleteConfirmView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  try {
    const itemData = await invModel.getInventoryById(inv_id) // usar o invModel, não inventoryModel
    if (!itemData) {
      res.status(404).render("errors/404", { title: "Inventory Item Not Found", nav })
      return
    }
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("inventory/delete-confirm", {
      title: `Delete ${itemName}`,
      nav,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price
    })
  } catch (error) {
    next(error)
  }
}

invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id)
  try {
    const result = await invModel.deleteInventoryItem(inv_id)
    if (result.rowCount) {
      req.flash("success", "Inventory item deleted successfully.")
      res.redirect("/inv/")
    } else {
      req.flash("error", "Failed to delete inventory item.")
      res.redirect(`/inv/delete/${inv_id}`)
    }
  } catch (error) {
    next(error)
  }
}

module.exports = invCont;
