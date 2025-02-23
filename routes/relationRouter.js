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

const router = express.Router();

router.get("/", relationController);
router.get("/:id", getRelationController);
router.post("/create", createRelationController);
router.put("/:id", updateRelationController);
router.get("/active/:id", getRelationActiveCTL);
router.put("/active/:id", deleteRelationController);
// -------------------------------------------- END --------------------------------------------

// get relation ship
router.get("/citizen_relations/:id", relationWithCitizenCTL);

module.exports = router;
