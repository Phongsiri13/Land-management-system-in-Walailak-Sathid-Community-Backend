// routes/authRouter.js
const express = require("express");
const {
  landStatusController,
  createStatusController,
  deleteStatusController,
  getOneStatusController,
  updateOneStatusController
} = require("../controllers/landStatus_controller");
const { pool } = require("../config/config_db");

const router = express.Router();

router.get("/", landStatusController);
router.get("/:id", getOneStatusController);
router.post("/create", createStatusController);
router.put("/:id", updateOneStatusController);
// DELETE route to delete a record by ID
router.delete("/:id", deleteStatusController);
// -------------------------------------------- END --------------------------------------------

module.exports = router;
