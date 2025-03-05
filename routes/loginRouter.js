// routes/authRouter.js
const express = require("express");
const router = express.Router();
const checkRole = require("../middlewares/checkRole");
const { loginCTL } = require("../controllers/userAccount_controller");
const { authenticateJWT } = require("../middlewares/authJWT");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

// router.get("/",(req, res) => {
//     res.send('This is login page')
// });
// loginCTL

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

router.get(
  "/protectedRole1",
  authenticateJWT,
  authorizeRoles("R001"),
  (req, res) => {
    res
      .status(200)
      .json({ message: "This is a protected route.", user: req.user });
  }
);

router.post("/logout", (req, res) => {
  res.clearCookie("jwt"); // Clear the JWT cookie
  res.status(200).json({ message: "Logged out successfully!" });
});

// ✅ Route ที่ต้องการให้เฉพาะ R001 (Admin) ใช้งานได้
// router.get("/admin", authenticateJWT, authorizeRoles("R001"), (req, res) => {
//   res.json({ message: "Admin access granted!" });
// });

// // ✅ Route สำหรับ R002 และ R003 เท่านั้น
// router.get("/user-data", authenticateJWT, authorizeRoles("R002", "R003"), (req, res) => {
//   res.json({ message: "User Data Accessed!" });
// });

// login to system
// router.post('/', (req, res) => {
//   const { username, password } = req.body;

//   console.log("session-id:", username, " : ", password);
//   res.send({ message: 'Logged in', role: 1 });
// });

// app.get('/protected', authenticateJWT, (req, res) => {
//   res.status(200).json({ message: 'This is a protected route.', user: req.user });
// });

router.get("/check_role", checkRole, (req, res) => {
  console.log("session-id:", req.sessionID);
  res.send("This is admin");
});

router.post("/clear-user", (req, res) => {
  // ลบ session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("ไม่สามารถออกจากระบบได้");
    }

    // ลบ cookie connect.sid โดยการตั้งค่าสิทธิ์ในคำตอบ
    res.clearCookie("connect.sid", { path: "/" });
    // ส่งคำตอบว่าออกจากระบบสำเร็จ
    res.send("ลบข้อมูลผู้ใช้ใน session เรียบร้อยแล้ว");
  });
});

module.exports = router;
