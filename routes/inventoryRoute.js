const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const { body } = require("express-validator")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to management view (task 1)
router.get("/", invController.managementView);
router.get('/add-inventory', invController.addInventoryView);
// Route to build single vehicle detail view
router.get("/detail/:inv_id", invController.buildDetailView);

// Route to trigger intentional error (task 3)
router.get("/trigger-error", invController.throwError);

// === TASK 2 - Add classification routes ===

// Show add classification form
router.get("/classification/add", invController.addClassificationView);

// Process add classification form (with server-side validation)
router.post(
  "/classification/add",
  body("classification_name")
    .trim()
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage("No spaces or special characters allowed"),
  invController.addClassificationProcess
);

router.post(
  '/add-inventory',
  [
    body('classification_id').notEmpty().withMessage('Classification is required.'),
    body('inv_make').trim().notEmpty().withMessage('Make is required.'),
    body('inv_model').trim().notEmpty().withMessage('Model is required.'),
    body('inv_year').isInt({ min: 1900, max: 2099 }).withMessage('Year must be between 1900 and 2099.'),
    body('inv_description').trim().notEmpty().withMessage('Description is required.'),
    body('inv_price').isFloat({ min: 0 }).withMessage('Price must be a positive number.'),
    body('inv_miles').isInt({ min: 0 }).withMessage('Miles must be a positive integer.'),
    body('inv_color').trim().notEmpty().withMessage('Color is required.'),
    // image and thumbnail can be optional or validated as strings
  ],
  invController.addInventoryProcess
);

module.exports = router;
