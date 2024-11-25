// routes/authRouter.js
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const authMiddle = require('../middlewares/authMiddle')
const db = require("../config_db");

// Serve the login form at the root path '/'
router.get("/",(req, res) => {
  // Check if the user is already logged in
  if (req.session.userId) {
    return res.redirect("/upload"); // Redirect to upload page if logged in
  }
  res.render("login"); // Render the login form if not logged in
});

// Handle login form submission
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM Users WHERE username = ?",
    [username],
    async (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).json({ error: "User not found" });
      }

      const user = results[0];
      // const isMatch = await bcrypt.compare(password, user.password);

      if (user.password != password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // สร้าง session token และบันทึกลงในตาราง Sessions
      const sessionToken = require("crypto").randomBytes(64).toString("hex");
      req.session.userId = user.id;
      req.session.sessionToken = sessionToken;
      console.log(sessionToken);

      db.query(
        "INSERT INTO sessions (user_id, session_token) VALUES (?, ?)",
        [user.id, sessionToken],
        (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: "Failed to create session" });
          }
          // ตั้งค่า sessionToken ใน headers ของการตอบกลับ
          let csrfToken = sessionToken
          res.setHeader("Authorization", `Bearer ${sessionToken}`);
          res
            .status(200)
            .render('upload')
        }
      );
    }
  );
});

module.exports = router;
