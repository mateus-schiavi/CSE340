const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const { body } = require("express-validator")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to management view (task 1)
router.get("/", invController.managementView);

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

module.exports = router;
