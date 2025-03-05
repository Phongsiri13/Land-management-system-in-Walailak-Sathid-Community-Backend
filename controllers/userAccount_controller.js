require("dotenv").config();
// Model
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { userSchema, userLoginSchema } = require("../validation/userSchema");
const userModel = require("../model/userModel");

const SECRET_KEY = process.env.SECRET_KEY;

const registerCTL = async (req, res) => {
  const data = req.body;
  console.log("data:", data);

  try {
    // ตรวจสอบความถูกต้องของข้อมูลตาม schema
    const { error, value } = userSchema.validate(req.body);

    if (error) {
      throw {
        statusCode: 400, // Bad Request
        message: `ข้อมูลที่ให้มาไม่ถูกต้อง!`,
      };
    }

    console.log("Validated Data:", value);

    // Hash รหัสผ่าน
    const password = value.password;
    const hashedPassword = await bcrypt.hash(password, 8);
    value["password"] = hashedPassword;

    // แปลงข้อมูลเป็น array ก่อนส่งไป registerUser
    const valuesArray = Object.values(value);
    console.log("valuesArray:", valuesArray);

    // บันทึกลงฐานข้อมูล
    const user_model = await userModel.registerUser(valuesArray);
    console.log("hashedPassword:", hashedPassword);
    console.log("user_model:", user_model);

    if (user_model) {
      return res.status(201).json({ message: "เพิ่มบัญชีข้อมูลสำเร็จ!" });
    } else {
      throw {
        statusCode: 400, // Bad Request
        message: "เพิ่มบัญชีข้อมูลไม่สำเร็จ!",
      };
    }
  } catch (err) {
    console.error("error:", err); // ตรวจสอบข้อผิดพลาดที่เกิดขึ้น

    // ใช้ค่า default statusCode = 500 หากไม่มี statusCode ใน error
    const statusCode = err.statusCode || 500;
    const message = err.message || "Unknown Error";

    return res.status(statusCode).json({
      statusCode: err.statusCode,
      status: "error",
      message: message,
    });
  }
};

const loginCTL = async (req, res) => {
  const data = req.body;
  console.log("data:", data);

  try {
    // ตรวจสอบความถูกต้องของข้อมูลตาม schema
    const { error, value } = userLoginSchema.validate(req.body);

    if (error) {
      throw {
        statusCode: 400, // Bad Request
        message: `ข้อมูลที่ให้มาไม่ถูกต้อง!`,
      };
    }

    // แปลงข้อมูลเป็น array ก่อนส่งไป registerUser
    const valuesArray = Object.values(value);
    console.log("valuesArray:", valuesArray[0]);

    // ดึงข้อมูลผู้ใช้จากฐานข้อมูลตาม username
    const user_model = await userModel.loginUser(valuesArray[0]); // Assuming the first element is the username

    if (!user_model || user_model.length === 0) {
      throw {
        statusCode: 404, // Not Found
        message: "ไม่พบผู้ใช้นี้ในระบบ!",
      };
    }

    // เปรียบเทียบรหัสผ่านที่กรอกกับรหัสผ่านที่เก็บไว้
    const isPasswordValid = await bcrypt.compare(
      valuesArray[1], // password from input
      user_model[0].password // password from db
    );

    if (!isPasswordValid) {
      throw {
        statusCode: 401, // Unauthorized
        message: "รหัสผ่านไม่ถูกต้อง!",
      };
    }
    const TOKEN_TIME = "1h";
    const USERNAME = user_model[0].username;
    const USER_ID = user_model[0].user_id;
    const USER_ROLE = user_model[0].id_role
    console.log("::::", USER_ROLE);

    // send jwt token
    const token = jwt.sign(
      { username: USERNAME },
      SECRET_KEY,
      { expiresIn: TOKEN_TIME } // Token expires in 1 hour
    );

    // Set JWT token expiration and creation times
    const jwtCreatedAt = new Date()
      .toISOString()
      .replace("T", " ")
      .replace("Z", ""); // แปลงเป็นรูปแบบ YYYY-MM-DD HH:mm:ss
    const jwtExpiresAt = new Date(Date.now() + 60 * 60 * 1000)
      .toISOString()
      .replace("T", " ")
      .replace("Z", ""); // แปลงเป็นรูปแบบ YYYY-MM-DD HH:mm:ss
    // Save JWT, jwt_created_at, and jwt_expires_at to the database
    const updatedUser = await userModel.updateUserJWT(
      USER_ID, // แก้เป็น USER_ID
      token,
      jwtCreatedAt,
      jwtExpiresAt
    );

    if (updatedUser) {
      // Send the JWT token as a cookie
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use 'secure' in production for HTTPS
        maxAge: 3600000, // 1 hour
      });

      return res.status(200).json({ message: "Login successful!", role: USER_ROLE});
    } else {
      return res
        .status(500)
        .json({ message: "Failed to update JWT in database." });
    }
  } catch (err) {
    console.error("error:", err); // ตรวจสอบข้อผิดพลาดที่เกิดขึ้น

    // ใช้ค่า default statusCode = 500 หากไม่มี statusCode ใน error
    // const statusCode = err.statusCode || 500;
    // const message = err.message || "Unknown Error";

    return res.status(500).json({
      message: "ระบบขัดข้อง",
    });
  }
};

module.exports = {
  registerCTL,
  loginCTL,
};
