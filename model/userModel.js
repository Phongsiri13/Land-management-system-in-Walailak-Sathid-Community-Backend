const {
  insertDataToDB,
  getDataAllWithOneFromDB,
  updateOneDataToDB,
  getSearchOneDataFromDB,
  getDataAllFromDB,
} = require("../config/config_db");

// UserModel.js
const UserModel = {
  allUser: async () => {
    const query = `SELECT * 
          FROM users
          JOIN roles ON users.id_role = roles.role_id
          LEFT JOIN prefix ON users.user_prefix = prefix.prefix_id
          WHERE users.id_role <> 'R003'
          ORDER BY users.id_role, users.user_actived DESC;
          `;
    const results = await getDataAllFromDB(query);

    // เลือกเฉพาะฟิลด์ที่ต้องการ
    return results.map(
      (user) =>
        ({
          user_id: user.user_id,
          username: user.username,
          user_prefix: user.user_prefix,
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: user.phone_number,
          id_role: user.id_role,
          role_name: user.role_name,
          role_actived: user.role_actived,
          prefix_name: user.prefix_name,
          user_actived: user.user_actived,
        } || [])
    );
  },
  registerUser: async (user_data) => {
    console.log("user:", user_data);
    const query = `INSERT INTO users (
      username, password, user_prefix, first_name, last_name, phone_number, id_role
    ) VALUES (?, ?, ?, ?, ?, ?, ?);`;

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
      "SELECT user_id, username, password, id_role FROM users WHERE username = ? AND user_actived = '1' LIMIT 1;";

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
  delUser: async (user_data) => {
    const query = `UPDATE users 
      SET user_actived = ? 
      WHERE user_id = ? AND username = ?;`;
    const results = await updateOneDataToDB(query, user_data);
    return results;
  },
  userInformationUpdate: async (user_data, statusPassword = false) => {
    console.log('user-1:',user_data)
    let query;
    if (statusPassword == true) {
      query = `
        UPDATE users
        SET id_role = ?, user_prefix = ?, first_name = ?, last_name = ?,
        phone_number = ?, password = ?
        WHERE user_id = ?;
      `;
    } else {
      query = `
    UPDATE users
    SET id_role = ?, user_prefix = ?, first_name = ?, last_name = ?,
    phone_number = ?
    WHERE user_id = ?;
  `;
    }
    const result = await updateOneDataToDB(query, user_data);
    return result;
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
      return result;
    } catch (err) {
      console.error("Error updating JWT in database:", err);
      throw new Error("Failed to update JWT token.");
    }
  },
  getRoleActive: async (actived) => {
    console.log("user:", actived);
    const query =
      "SELECT *FROM roles WHERE role_actived = ? AND role_id <> 'R003' ;";

    const results = await getDataAllWithOneFromDB(query, actived);
    return results;
  },
  getOneRole: async (role_id) => {
    console.log("user:", role_id);
    const query = "SELECT * FROM roles WHERE role_id = ? LIMIT 1;";

    try {
      const results = await getSearchOneDataFromDB(query, [role_id]); // ใช้ [role_id] เพื่อป้องกัน SQL Injection

      if (!results || results.length === 0) {
        throw {
          statusCode: 404,
          message: "Role not found",
        };
      }

      console.log("role:", results[0]); // results ควรเป็นอาร์เรย์ จึงเข้าถึงตัวแรกด้วย [0]
      return results[0]; // ส่งคืน object ตัวเดียวแทนการส่งอาร์เรย์
    } catch (err) {
      console.log("error:", err);

      if (err.statusCode) {
        throw err; // กรณี error แบบกำหนดเอง (เช่น 404)
      }

      // กรณีข้อผิดพลาดทั่วไป
      throw {
        statusCode: 500,
        message: "An unexpected error occurred while fetching role data",
      };
    }
  },
  createRole: async (role_name) => {
    const query = `
    INSERT INTO roles (role_name) 
    VALUES (?);`;
    const results = await insertDataToDB(query, role_name);
    return results;
  },
  updateOneRole: async (values) => {
    const query = `UPDATE roles 
      SET role_name = ? 
      WHERE role_id = ?;`;
    const results = await updateOneDataToDB(query, values);
    console.log(results);
    return results;
  },
  deleteOneRole: async (values) => {
    const query = `UPDATE roles 
      SET role_actived = ? 
      WHERE role_id = ?;`;
    const results = await updateOneDataToDB(query, values);
    console.log(results);
    return results;
  },
};

module.exports = UserModel;
