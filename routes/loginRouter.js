// routes/authRouter.js
const express = require("express");
const router = express.Router();
const checkRole = require("../middlewares/checkRole");
const { loginCTL } = require("../controllers/userAccount_controller");
const { authenticateJWT } = require("../middlewares/authJWT");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

// for verify role
router.get("/profile", authenticateJWT, (req, res) => {
  res.json({ message: "Profile data", user: req.user });
});

router.post("/", loginCTL);

router.get("/protected", authenticateJWT, (req, res) => {
  res
    .status(200)
    .json({ message: "This is a protected route.", user: req.user });
});

// router.get(
//   "/protectedRole1",
//   authenticateJWT,
//   authorizeRoles("R001"),
//   (req, res) => {
//     res
//       .status(200)
//       .json({ message: "This is a protected route.", user: req.user });
//   }
// );

router.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/", httpOnly: true, secure: true, sameSite: "None" });
  res.status(200).json({ message: "Logged out successfully!" });
});

module.exports = router;
