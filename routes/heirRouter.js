// routes/authRouter.js
const express = require("express");
const { relationController } = require("../controllers/relation_controller");
const { addHeirController, addHeirAllController,
    getHeirFullNameCTL, getAllHeirCTL, getOneHeirCTL, updateHeirAllCTL,
    getHeirAmountPageCTL, getAllHeirWithRelationCTL, getAllHeirWithRelationToCitizenCTL,getHeirNameCTL
 } = require("../controllers/heir_controller");
const { pool } = require("../config/config_db");

const router = express.Router();

router.get("/relation", relationController);
router.get("/fullname", getHeirFullNameCTL);
router.get("/:id", getOneHeirCTL);
router.get("/related_heir/:id", getAllHeirWithRelationCTL);
router.get("/related_citizen/:id", getAllHeirWithRelationToCitizenCTL);
router.get("/:amount/:page", getHeirAmountPageCTL);
router.get("/fullname/suggest/:name", getHeirNameCTL);
router.post("/searchHeirAll", getAllHeirCTL);   
router.post("/", addHeirController);
router.post("/all", addHeirAllController);
router.put("/:id", updateHeirAllCTL);


// -------------------------------------------- END --------------------------------------------

module.exports = router;
