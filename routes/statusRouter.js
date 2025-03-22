// routes/authRouter.js
const express = require("express");
const {
  landStatusController,
  createStatusController,
  deleteStatusController,
  getOneStatusController,
  updateOneStatusController,
  getOneStatusActiveCTL
} = require("../controllers/landStatus_controller");
const { pool } = require("../config/config_db");
const { authenticateJWT } = require("../middlewares/authJWT");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", landStatusController);
router.get("/:id", authenticateJWT,authorizeRoles("R001", "R002"), getOneStatusController);
router.get("/active/:id", authenticateJWT,authorizeRoles("R001", "R002"), getOneStatusActiveCTL);
router.post("/create", authenticateJWT,authorizeRoles("R001"), createStatusController);
// DELETE route to delete a record by ID
router.put("/:id", authenticateJWT,authorizeRoles("R001"), updateOneStatusController);
router.put("/active/:id", authenticateJWT,authorizeRoles("R001"), deleteStatusController);
// -------------------------------------------- END --------------------------------------------

module.exports = router;
