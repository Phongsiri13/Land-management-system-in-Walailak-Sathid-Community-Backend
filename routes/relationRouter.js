const express = require("express");
const {
    relationController,
    getRelationController,
    createRelationController,
    updateRelationController,
    deleteRelationController,
    relationWithCitizenCTL,
    getRelationActiveCTL
} = require("../controllers/relation_controller");
const { pool } = require("../config/config_db");
const AUTH_ROLE = require('../middlewares/authName')
const { authenticateJWT } = require("../middlewares/authJWT");
const { authorizeRoles } = require("../middlewares/roleMiddleware");


const router = express.Router();

router.get("/", authenticateJWT, relationController);
router.get("/:id", authenticateJWT,authorizeRoles("R001", "R002"), getRelationController);
router.get("/active/:id", authenticateJWT,authorizeRoles("R001", "R002"), getRelationActiveCTL);
router.post("/create", authenticateJWT,authorizeRoles("R001"), createRelationController);
router.put("/:id", authenticateJWT,authorizeRoles("R001"), updateRelationController);
router.put("/active/:id", authenticateJWT,authorizeRoles("R001"), deleteRelationController);
// -------------------------------------------- END --------------------------------------------

// get relation ship
router.get("/citizen_relations/:id", authenticateJWT,authorizeRoles("R001", "R002"),relationWithCitizenCTL);

module.exports = router;
