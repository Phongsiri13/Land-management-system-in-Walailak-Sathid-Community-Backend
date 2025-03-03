// routes/authRouter.js
const express = require("express");
const { landUsageCTL, updateOneLandUsageCTL, getOnelandUsageCTL
    ,getOneLandUsageActiveCTL
} = require("../controllers/landUse_controller");
const { pool } = require("../config/config_db");

const router = express.Router();

router.get("/", landUsageCTL);
router.get("/:id", getOnelandUsageCTL);
// router.post("/create", createStatusController);
// DELETE route to delete a record by ID
router.get("/active/:id", getOneLandUsageActiveCTL);
router.put("/:id", updateOneLandUsageCTL);
// -------------------------------------------- END --------------------------------------------

module.exports = router;
