const { body, validationResult } = require("express-validator");
const utilities = require("./");

/* ***************************
 * Inventory Data Validation Rules
 * ************************** */
const inventoryRules = () => {
    return [
        body("classification_id")
            .isInt({ min: 1 })
            .withMessage("Please select a valid classification."),
        body("inv_make")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a make."),
        body("inv_model")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a model."),
        body("inv_year")
            .isInt({ min: 1900, max: 2099 })
            .withMessage("Please provide a valid year."),
        body("inv_description")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a description."),
        body("inv_image")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide an image path."),
        body("inv_thumbnail")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a thumbnail path."),
        body("inv_price")
            .isFloat({ min: 0 })
            .withMessage("Please provide a valid price."),
        body("inv_miles")
            .isInt({ min: 0 })
            .withMessage("Please provide valid miles."),
        body("inv_color")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a color."),
    ];
};

/* ***************************
 * Check data and return errors for Add Inventory
 * ************************** */
const checkInventoryData = async (req, res, next) => {
    const {
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
    } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const nav = await utilities.getNav();
        const classificationList = await utilities.buildClassificationList(classification_id);
        res.render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            classificationList,
            errors: errors.array(),
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
        });
        return;
    }
    next();
};

/* ***************************
 * Check data and return errors for Edit Inventory
 * ************************** */
const checkUpdateData = async (req, res, next) => {
    const {
        inv_id,
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
    } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const nav = await utilities.getNav();
        const classificationList = await utilities.buildClassificationList(classification_id);
        res.render("inventory/edit-inventory", {
            title: "Edit " + inv_make + " " + inv_model,
            nav,
            classificationSelect: classificationList,
            errors: errors.array(),
            inv_id,
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
        });
        return;
    }
    next();
};

module.exports = {
    inventoryRules,
    checkInventoryData,
    checkUpdateData,
};
