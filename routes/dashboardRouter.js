// routes/authRouter.js
const express = require("express");
const {
    dashboardCTL, dashboardCitizenTableCTL,
    dashboardOneCTL, dashboardTableCTL
} = require("../controllers/dashboard_controller");
const { pool } = require("../config/config_db");

const router = express.Router();

router.get("/", dashboardCTL);
router.get("/summary", dashboardTableCTL);
router.get("/summary_citizen", dashboardCitizenTableCTL);
router.get("/:id", dashboardOneCTL);
// router.get("/summary/:id", dashboardCTL);

// -------------------------------------------- END --------------------------------------------

module.exports = router;
