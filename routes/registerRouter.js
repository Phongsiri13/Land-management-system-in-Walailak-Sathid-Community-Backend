// routes/authRouter.js
const express = require("express");
const router = express.Router();
const { registerCTL } = require("../controllers/userAccount_controller");

// router.get("/",(req, res) => {
//     res.send('This is login page')
// });

// login to system
router.post("/", registerCTL);

module.exports = router;
