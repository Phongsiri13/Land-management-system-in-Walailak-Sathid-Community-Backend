// routes/authRouter.js
const express = require("express");
const { landUsageCTL, updateOneLandUsageCTL, getOnelandUsageCTL
    ,getOneLandUsageActiveCTL, createLandUsageCTL, delOneLandUsageCTL
} = require("../controllers/landUse_controller");
const { pool } = require("../config/config_db");

const router = express.Router();

router.get("/", landUsageCTL);
router.get("/:id", getOnelandUsageCTL);
router.post("/create", createLandUsageCTL);
// DELETE route to delete a record by ID
router.get("/active/:id", getOneLandUsageActiveCTL);
router.put("/:id", updateOneLandUsageCTL);
router.put("/active/:id", delOneLandUsageCTL);
// -------------------------------------------- END --------------------------------------------

module.exports = router;
