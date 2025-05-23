const system_config = require('../config/config_system');

// Model
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  userSchema,
  userLoginSchema,
  userPersonalDataUpdateSchema,
} = require("../validation/userSchema");
const userModel = require("../model/userModel");

const SECRET_KEY = system_config.SECRET_KEY;

const getAllUsers = async (req, res) => {
  const data = req.body;
  console.log("data:", data);

  try {
    const user_model = await userModel.allUser();
    return res
      .status(200)
      .json({ message: "ดึงข้อมูลผู้ใช้สำเร็จ!", data: user_model });
  } catch (err) {
    return res.status(500).json({ message: "ระบบขัดข้อง" });
  }
};

const updatePersonalUserCTL = async (req, res) => {
  const data = req.body; // Access the sent data from the request body
  const id = req.params.id; // Get the ID from the URL

  if (!id) {
    return res.status(400).send({ message: "ID parameter is required" });
  }
  console.log("data:", data);

  console.log("--------------- User update data ---------------");
  // แยก password และ confirm_password ออกจาก data
  const { password, confirm_password, ...filteredData } = data;
  let status_password = false;
  // เก็บ password และ confirm_password เฉพาะเมื่อมีค่า
  const sensitiveData = {};
  if (password !== undefined) {
    sensitiveData.password = password;
    status_password = true;
  }

  console.log("sensitiveData:", sensitiveData);
  console.log("statusData:", status_password);
  try {
    const values = [];
    if (status_password === false) {
      const { error, value } =
        userPersonalDataUpdateSchema.validate(filteredData);

      if (error) {
        throw {
          statusCode: 400, // Bad Request
          message: `ข้อมูลที่ให้มาไม่ถูกต้อง!`,
        };
      }
      values.push(value.id_role, value.user_prefix || null,
        value.first_name || null,value.last_name || null,
        value.phone_number || null, id)
      // const values = [
      //   value.id_role,
      //   value.user_prefix,
      //   value.first_name,
      //   value.last_name,
      //   value.phone_number,
      //   id,
      // ];
    }else{
      const { error, value } =
        userPersonalDataUpdateSchema.validate(filteredData);

      if (error) {
        throw {
          statusCode: 400, // Bad Request
          message: `ข้อมูลที่ให้มาไม่ถูกต้อง!`,
        };
      }
      const hashedPassword = await bcrypt.hash(sensitiveData.password, 8);

      values.push(value.id_role, value.user_prefix, value.first_name, value.last_name, value.phone_number,
        hashedPassword, id
      );
      console.log(values)
    }

    // console.log(values);
    const results = await userModel.userInformationUpdate(values, status_password);
    if (results == true) {
      return res.status(200).json({
        success: true,
        message: "อัพเดทสิทธิ์ผู้ใช้สำเร็จ!",
      });
    } else {
      throw {
        statusCode: 400,
        success: false,
        message: "อัพเดทสิทธิ์ผู้ใช้ไม่สำเร็จ!",
      };
    }
  } catch (err) {
    console.log(err);
    if (err.statusCode == 400) {
      return res.json(err);
    }
    res.status(500).send("ระบบขัดข้อง");
  }
};

const delUserCTL = async (req, res) => {
  const userActived = req.body; // Access the sent data from the request body
  const id = req.params.id; // Get the ID from the URL

  if (!id) {
    return res.status(400).send({ message: "ID parameter is required" });
  }

  try {
    const values = [userActived.user_actived, id, userActived.username];
    const results = await userModel.delUser(values);
    if (results == true) {
      return res.status(200).json({
        success: true,
        message: "ลบสิทธิ์ผู้ใช้สำเร็จ!",
      });
    } else {
      throw {
        statusCode: 400,
        success: false,
        message: "ลบสิทธิ์ผู้ใช้ไม่สำเร็จ!",
      };
    }
  } catch (err) {
    console.log(err);
    if (err.statusCode == 400) {
      return res.json(err);
    }
    res.status(500).send("ระบบขัดข้อง");
  }
};

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
    const valuesArray = [
      value.username,
      value.password,
      value.user_prefix,
      value.first_name,
      value.last_name,
      value.phone_number,
      value.id_role,
    ];
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
  // console.log("data:", data);

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
        status: false,
        message: "Username or Password ไม่ถูกต้อง!",
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
    const USER_ROLE = user_model[0].id_role;
    // console.log("::::", USER_ROLE);

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
      res.cookie("token", token, {
        httpOnly: false, // ใช้ `true` บน HTTPS
        // secure: process.env.NODE_ENV === "production", // Use 'secure' in production for HTTPS
        sameSite: "lax", // ป้องกัน CSRF
        maxAge: 3600000, // 1 hour
      });

      return res
        .status(200)
        .json({ message: "Login successful!", role: USER_ROLE });
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
  getAllUsers,
  updatePersonalUserCTL,
  registerCTL,
  loginCTL,
  delUserCTL,
};
