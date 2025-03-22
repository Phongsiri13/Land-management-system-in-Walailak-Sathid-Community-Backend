// routes/authRouter.js
const express = require("express");
const router = express.Router();
const { registerCTL } = require("../controllers/userAccount_controller");
const { authenticateJWT } = require("../middlewares/authJWT");
const { authorizeRoles } = require("../middlewares/roleMiddleware");


// login to system
router.post("/", authenticateJWT, authorizeRoles("R001"), registerCTL);

module.exports = router;
