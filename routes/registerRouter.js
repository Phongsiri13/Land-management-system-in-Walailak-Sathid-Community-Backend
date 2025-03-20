// routes/authRouter.js
const express = require("express");
const router = express.Router();
const { registerCTL } = require("../controllers/userAccount_controller");

// login to system
router.post("/", registerCTL);

module.exports = router;
