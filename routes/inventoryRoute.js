const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build single vehicle detail view
router.get("/detail/:inv_id", invController.buildDetailView);

// Rota para disparar erro intencional (task 3)
router.get("/trigger-error", invController.throwError);

module.exports = router;
