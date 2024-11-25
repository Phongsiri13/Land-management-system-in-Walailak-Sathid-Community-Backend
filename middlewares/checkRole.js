const roles = [3]

// Middleware ตรวจสอบ role
const checkRole = (req, res, next) => {
  // console.log("req.session.user.role:", req.session.user.role)
  try {
    // ตรวจสอบว่ามีข้อมูลใน session และ role ตรงกับที่ต้องการหรือไม่
    if (req.session.user && req.session.user.username && req.session.user.role === roles[0]) {
      next();  // ถ้าเงื่อนไขผ่าน ก็ให้ดำเนินการไปยัง middleware ถัดไป
    } else {
      console.log('forbidden')
      // ถ้า role ไม่ตรง หรือไม่มีข้อมูล session ให้ส่ง 403 Forbidden
      res.status(403).send("Forbidden");
    }
  } catch (error) {
    // จับข้อผิดพลาดที่อาจเกิดขึ้นในระหว่างการตรวจสอบ
    console.error("Error in checkRole middleware:", error);
    res.status(500).send("Internal Server Error");
  }
};


module.exports = checkRole;
