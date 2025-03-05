const {
  insertDataToDB,
  getDataAllWithOneFromDB,
  updateOneDataToDB
} = require("../config/config_db");

// UserModel.js
const UserModel = {
  registerUser: async (user_data) => {
    console.log("user:", user_data);
    const query = `INSERT INTO users (
      username, password, user_prefix, first_name, last_name, phone_number, id_role, jwt_token, 
      jwt_created_at, jwt_expires_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

    try {
      // เรียกใช้ insertDataToDB เพื่อแทรกข้อมูล
      const results = await insertDataToDB(query, user_data);
      console.log("results:", results);
      return results; // ส่งคืนผลลัพธ์ที่ได้
    } catch (err) {
      console.log("error:", err);
      // กรณีข้อผิดพลาดทั่วไป
      throw {
        statusCode: err.statusCode, // Internal Server Error
        status: err.status,
        message: err.message,
      };
    }
  },
  loginUser: async (user_login) => {
    console.log("user:", user_login);
    const query =
      "SELECT user_id, username, password, id_role FROM users WHERE username = ? LIMIT 1;";

    try {
      // เรียกใช้ insertDataToDB เพื่อแทรกข้อมูล
      const results = await getDataAllWithOneFromDB(query, [user_login]);
      // console.log("results:", results);
      return results; // ส่งคืนผลลัพธ์ที่ได้
    } catch (err) {
      console.log("error:", err);
      // กรณีข้อผิดพลาดทั่วไป
      throw {
        statusCode: 500,
        message: "An unexpected error occurred while fetching user data",
      };
    }
  },
  updateUserJWT: async (userId, token, jwtCreatedAt, jwtExpiresAt) => {
    const query = `
    UPDATE users
    SET jwt_token = ?, jwt_created_at = ?, jwt_expires_at = ?
    WHERE user_id = ?;
  `;

    try {
      const result = await updateOneDataToDB(query, [
        token,
        jwtCreatedAt,
        jwtExpiresAt,
        userId,
      ]);
      return result
    } catch (err) {
      console.error("Error updating JWT in database:", err);
      throw new Error("Failed to update JWT token.");
    }
  },
};

module.exports = UserModel;
