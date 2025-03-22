// routes/authRouter.js
const express = require("express");
const {
    dcLandTypeController,
    getOneDcLandTypeController,
    createDcLandTypeController,
    deleteDcLandTypeController,
    updateDcLandTypeController
} = require("../controllers/documentTypeController");
const AUTH_ROLE = require('../middlewares/authName')
const { authenticateJWT } = require("../middlewares/authJWT");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", dcLandTypeController);
router.get("/:id", authenticateJWT,authorizeRoles("R001", "R002"), getOneDcLandTypeController);
router.post("/create", authenticateJWT,authorizeRoles("R001"), createDcLandTypeController);
router.put("/:id", authenticateJWT,authorizeRoles("R001"), updateDcLandTypeController);
router.delete("/:id", authenticateJWT,authorizeRoles("R001"), deleteDcLandTypeController);
// -------------------------------------------- END --------------------------------------------

module.exports = router;
