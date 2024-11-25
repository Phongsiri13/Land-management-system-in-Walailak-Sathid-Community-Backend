// routes/authRouter.js
const express = require("express");
const router = express.Router();
const checkRole = require('../middlewares/checkRole')

router.get("/",(req, res) => {
    res.send('This is login page')
});

// login to system
router.post('/', (req, res) => {
  const { username, password } = req.body;
  
  // ตรวจสอบผู้ใช้และรหัสผ่าน (จำลองข้อมูลจาก database)
  const user = { username, role: 3 }; // กำหนด role เช่น 'user', 'officer', 'admin'

  // หากตรวจสอบสำเร็จ เก็บ role ใน session
  // req.session.user = { username: user.username, role: user.role };
  req.session.user = { username: "dsadsa", role: user.role };
  console.log("session-id:", req.sessionID)
  res.send({ message: 'Logged in', role: user.role });
});

router.get("/check_role", checkRole, (req, res) => {
  console.log("session-id:", req.sessionID)
  res.send('This is admin')
});

router.post('/clear-user', (req, res) => {
  // ลบ session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('ไม่สามารถออกจากระบบได้');
    }

    // ลบ cookie connect.sid โดยการตั้งค่าสิทธิ์ในคำตอบ
    res.clearCookie('connect.sid', { path: '/' });
    // ส่งคำตอบว่าออกจากระบบสำเร็จ
    res.send('ลบข้อมูลผู้ใช้ใน session เรียบร้อยแล้ว');
  });
});


module.exports = router;
