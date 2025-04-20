// routes/authRouter.js
const express = require("express");
const router = express.Router();
const { registerCTL } = require("../controllers/userAccount_controller");
const { authenticateJWT } = require("../middlewares/authJWT");
const { authorizeRoles } = require("../middlewares/roleMiddleware");
const { pool } = require('../config/config_db')


// login to system
router.post("/", authenticateJWT, authorizeRoles("R003"), registerCTL);

module.exports = router;
