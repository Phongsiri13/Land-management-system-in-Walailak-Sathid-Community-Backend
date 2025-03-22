// routes/authRouter.js
const express = require("express");
const { relationController } = require("../controllers/relation_controller");
const { addHeirController, addHeirAllController,
    getHeirFullNameCTL, getAllHeirCTL, getOneHeirCTL, updateHeirAllCTL,
    getHeirAmountPageCTL, getAllHeirWithRelationCTL, getAllHeirWithRelationToCitizenCTL,
    getOneRelationCitizenAndHeirCTL
 } = require("../controllers/heir_controller");
const AUTH_ROLE = require('../middlewares/authName')
const { authenticateJWT } = require("../middlewares/authJWT");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/relation", relationController);
router.get("/fullname", authenticateJWT,authorizeRoles("R001", "R002"), getHeirFullNameCTL);
router.get("/citizen/related/heir/:citizen_id", authenticateJWT,authorizeRoles("R001", "R002"), getOneRelationCitizenAndHeirCTL);
router.get("/related_heir/:id", authenticateJWT,authorizeRoles("R001", "R002"), getAllHeirWithRelationCTL);
router.get("/related_citizen/:id", authenticateJWT,authorizeRoles("R001", "R002"), getAllHeirWithRelationToCitizenCTL);
router.get("/:amount/:page", authenticateJWT,authorizeRoles("R001", "R002"), getHeirAmountPageCTL);
router.get("/:id", authenticateJWT,authorizeRoles("R001", "R002"), getOneHeirCTL);

// POST 
router.post("/", authenticateJWT,authorizeRoles("R001"), addHeirController);
router.post("/searchHeirAll", authenticateJWT,authorizeRoles("R001", "R002"), getAllHeirCTL);   
router.post("/all", authenticateJWT,authorizeRoles("R001"), addHeirAllController);
router.put("/:id", authenticateJWT,authorizeRoles("R001"), updateHeirAllCTL);


// -------------------------------------------- END --------------------------------------------

module.exports = router;
