// routes/authRouter.js
const express = require("express");
const { landUsageCTL, updateOneLandUsageCTL, getOnelandUsageCTL
    ,getOneLandUsageActiveCTL, createLandUsageCTL, delOneLandUsageCTL
} = require("../controllers/landUse_controller");
const AUTH_ROLE = require('../middlewares/authName')
const { authenticateJWT } = require("../middlewares/authJWT");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", landUsageCTL);
router.get("/:id", getOnelandUsageCTL);
router.get("/active/:id", getOneLandUsageActiveCTL);
router.post("/create", authenticateJWT, authorizeRoles("R001"), createLandUsageCTL);
// DELETE route to delete a record by ID
router.put("/:id", authenticateJWT, authorizeRoles("R001"), updateOneLandUsageCTL);
router.put("/active/:id", authenticateJWT, authorizeRoles("R001"), delOneLandUsageCTL);
// -------------------------------------------- END --------------------------------------------

module.exports = router;
