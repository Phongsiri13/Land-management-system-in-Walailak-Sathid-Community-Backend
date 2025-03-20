// routes/authRouter.js
const express = require("express");
const { relationController } = require("../controllers/relation_controller");
const { addHeirController, addHeirAllController,
    getHeirFullNameCTL, getAllHeirCTL, getOneHeirCTL, updateHeirAllCTL,
    getHeirAmountPageCTL, getAllHeirWithRelationCTL, getAllHeirWithRelationToCitizenCTL,
    getOneRelationCitizenAndHeirCTL
 } = require("../controllers/heir_controller");

const router = express.Router();

router.get("/relation", relationController);
router.get("/fullname", getHeirFullNameCTL);
router.get("/citizen/related/heir/:citizen_id", getOneRelationCitizenAndHeirCTL);
router.get("/related_heir/:id", getAllHeirWithRelationCTL);
router.get("/related_citizen/:id", getAllHeirWithRelationToCitizenCTL);
router.get("/:amount/:page", getHeirAmountPageCTL);
router.get("/:id", getOneHeirCTL);

// POST 
router.post("/", addHeirController);
router.post("/searchHeirAll", getAllHeirCTL);   
router.post("/all", addHeirAllController);
router.put("/:id", updateHeirAllCTL);


// -------------------------------------------- END --------------------------------------------

module.exports = router;
