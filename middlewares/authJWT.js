const jwt = require("jsonwebtoken");
const { getDataAllWithOneFromDB } = require("../config/config_db");

const SECRET_KEY = process.env.SECRET_KEY; // ✅ ใช้ environment variable

const authenticateJWT = async (req, res, next) => {
  // console.log('req.cookies:', req.cookies);  
  try {
    const token = req.cookies.token; // ดึง JWT จาก Cookie
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // ใช้ Promise แทน Callback
    const user = await new Promise((resolve, reject) => {
      jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    console.log("Decoded User:", user);

    // ดึงข้อมูลจากฐานข้อมูล
    const query = `SELECT users.id_role, roles.role_name 
                   FROM users 
                   JOIN roles ON users.id_role = roles.role_id 
                   WHERE users.username = ? AND users.user_actived = '1'`;

    const results = await getDataAllWithOneFromDB(query, [user.username]);

    if (results.length === 0) {
      return res.status(403).json({ message: "User not found or inactive.", access: false });
    }

    // console.log("User in DB:", results[0]);

    // เพิ่มข้อมูล user role ลงใน req
    req.user = {
      ...user,
      role_name: results[0].role_name,
      role: results[0].id_role,
    };

    next(); // อนุญาตให้เข้าถึง Route ถัดไป
  } catch (error) {
    console.error("JWT Authentication Error:", error);
    return res.status(403).json({ message: "Invalid or expired token.", access: false });
  }
};

module.exports = { authenticateJWT };
