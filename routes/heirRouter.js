// routes/authRouter.js
const express = require("express");
const { relationController } = require("../controllers/relation_controller");
const { addHeirController, addHeirAllController,
    getHeirFullNameCTL, getAllHeirCTL, getOneHeirCTL
 } = require("../controllers/heir_controller");
const { pool } = require("../config/config_db");

const router = express.Router();

router.get("/relation", relationController);
router.get("/:id", getOneHeirCTL);
router.get("/fullname", getHeirFullNameCTL);
router.post("/searchHeirAll", getAllHeirCTL);
router.post("/", addHeirController);
router.post("/all", addHeirAllController);

// -------------------------------------------- END --------------------------------------------

module.exports = router;
