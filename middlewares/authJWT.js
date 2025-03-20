const jwt = require("jsonwebtoken");
const { getDataAllWithOneFromDB } = require("../config/config_db");

const SECRET_KEY = process.env.SECRET_KEY; // ใช้ environment variable เพื่อความปลอดภัย

const authenticateJWT = async (req, res, next) => {
  const token = req.cookies.jwt; // ดึง JWT จาก cookie
  console.log("token:", token);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  // ตรวจสอบ JWT
  jwt.verify(token, SECRET_KEY, async (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }
    console.log("user:", user);

    // ตรวจสอบว่าหมดอายุหรือไม่
    const currentTime = Math.floor(Date.now() / 1000); // เวลาปัจจุบัน (เป็นวินาที)
    if (user.exp < currentTime) {
      return res.status(401).json({ message: "Token expired." });
    }

    try {
      // ดึงข้อมูลจากฐานข้อมูล
      const query = `SELECT users.jwt_token, users.id_role, roles.role_name FROM users 
        JOIN roles ON users.id_role = roles.role_id
        WHERE users.username = ? AND users.user_actived = '1';`;
      const results = await getDataAllWithOneFromDB(query, [user.username]);
      console.log("jwt:", results);

      // ตรวจสอบความถูกต้องของ token
      if (results.length === 0 || results[0].jwt_token !== token) {
        return res.status(403).json({ message: "Token mismatch." });
      }

      req.user = user; // เก็บข้อมูล user ไว้ใน req
      req.user.role_name = results[0].role_name;
      req.user.role = results[0].id_role; // เก็บ role ไว้ใน req.user
      next(); // ไปยัง middleware หรือ route handler ถัดไป
    } catch (dbError) {
      return res.status(500).json({ message: "Database error." });
    }
  });
};

module.exports = { authenticateJWT };
