// routes/authRouter.js
const express = require("express");
const {
    dashboardCTL, dashboardCitizenTableCTL,
    dashboardOneCTL, dashboardTableCTL
} = require("../controllers/dashboard_controller");
const { pool } = require("../config/config_db");
const { authenticateJWT } = require("../middlewares/authJWT");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", dashboardCTL);
router.get("/summary", authenticateJWT,authorizeRoles("R001", "R002"), dashboardTableCTL);
router.get("/summary_citizen",authenticateJWT,authorizeRoles("R001", "R002"), dashboardCitizenTableCTL);
router.get("/:id", dashboardOneCTL);
// router.get("/summary/:id", dashboardCTL);

// -------------------------------------------- END --------------------------------------------

module.exports = router;
