const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const { body } = require("express-validator")
const utilities = require('../utilities')
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to management view (task 1)
router.get("/", invController.managementView)
router.get("/add-inventory", invController.addInventoryView)

// Route to build single vehicle detail view
router.get("/detail/:inv_id", invController.buildDetailView)

// Route to trigger intentional error (task 3)
router.get("/trigger-error", invController.throwError)

// === TASK 2 - Add classification routes ===

// Show add classification form
router.get("/classification/add", invController.addClassificationView)

// Process add classification form (with server-side validation)
router.post(
  "/classification/add",
  body("classification_name")
    .trim()
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage("No spaces or special characters allowed"),
  invController.addClassificationProcess
)

// Add inventory (cleaned up using validation middleware)
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventoryProcess)
)

// Get inventory JSON
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

// Nova rota para página de edição do inventário
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
)

// Route to process inventory update (Task 4)
router.post(
  "/update",
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.deleteConfirmView)
)

router.post(
  "/delete",
  utilities.handleErrors(invController.deleteInventory)
)

module.exports = router;
