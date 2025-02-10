const {
  getDataFromDB,
  insertDataToDB,
  getLikeSearchFromDB,
  getSearchDataFromDB,
  getSearchOneDataFromDB,
  updateOneDataToDB,
  pool,
} = require("../config/config_db");

const landModel = {
  getlandById: async (land_id) => {
    const query = `SELECT * FROM land WHERE id_land= ? LIMIT 1;`;
    const results = await getSearchOneDataFromDB(query, land_id);
    return results;
  },
  landAmountPage: async (page, size) => {
    const routePage = parseInt(page); // หน้า (default = 1)
    const limit = parseInt(size); // จำนวนข้อมูลต่อหน้า (default = 10)
    const offset = (routePage - 1) * size; // คำนวณตำแหน่งเริ่มต้นของข้อมูล

    const query = `
SELECT 
    CONCAT(
        COALESCE(pr.prefix_name, ''), 
        ' ', 
        COALESCE(p.first_name, ''), 
        ' ', 
        COALESCE(p.last_name, '')
    ) AS fullname,
    land_status_name, 
    l.id_land, 
    l.current_soi,
    l.current_land_status, 
    l.number, 
    l.active,
    p.phone_number
  FROM land l
  LEFT JOIN citizen p ON l.id_card = p.ID_CARD
  LEFT JOIN prefix pr ON p.prefix_id = pr.prefix_id
  LEFT JOIN land_status ls ON l.current_land_status = ls.ID_land_status
  ORDER BY l.created_at DESC
  LIMIT ? OFFSET ?;
    `;
    const results = await getSearchDataFromDB(query, [limit, offset]);
    return results;
  },
  addLand: async (landData) => {
    console.log("Received landData:", landData);

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert data into the `land` table
      const query_land = `
        INSERT INTO land (
          tf_number, spk_area, number, volume, l_house_number, current_soi, 
          rai, ngan, square_wa, l_district, l_village_number, notation, 
          current_land_status, id_card, \`long\`, \`lat\`, active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await connection.query(query_land, landData);

      // Generate land_id by combining tf_number and number
      const land_id = landData[2] + landData[0]; // tf_number + number
      console.log("Generated land_id:", land_id);

      // Insert data into the `land_use` table
      const query_land_use = `
        INSERT INTO land_use (
          land_id, rubber_tree, fruit_orchard, livestock_farming, other, details
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;

      const land_use_values = [land_id, "0", "0", "0", "0", null];
      await connection.query(query_land_use, land_use_values);

      await connection.commit();

      console.log(
        "✅ Transaction Success: Land and land use data added successfully."
      );
      return {
        statusCode: 200,
        status: true,
        message: "เพิ่มข้อมูลที่ดินและการใช้ที่ดินเรียบร้อยแล้ว",
      };
    } catch (err) {
      await connection.rollback();

      console.error("❌ Transaction Error:", err.message);
      if (err.code === "ER_DUP_ENTRY") {
        // MySQL error 1062
        console.error("Duplicate Entry Error:", err.message);
        return {
          statusCode: 409, // 409 Conflict
          status: false,
          message: "มีที่ดินนี้อยู่ในระบบอยู่แล้ว",
        };
      }

      console.error("❌ Transaction Error:", err.message);
      return {
        statusCode: 500, // Internal Server Error
        status: false,
        message: "ระบบขัดข้อง กรุณาลองใหม่ภายหลัง",
      };
    } finally {
      connection.release();
    }
  },
  updateLandOne: async (landData) => {
    const query = `
    UPDATE land
    SET 
      l_house_number = ?, 
      current_soi = ?, 
      rai = ?, 
      ngan = ?, 
      square_wa = ?, 
      l_district = ?, 
      l_village_number = ?, 
      notation = ?, 
      current_land_status = ?, 
      id_card = ?, 
      \`long\` = ?, 
      \`lat\` = ?
    WHERE id_land = ?;
  `;
    const results = await insertDataToDB(query, landData);
    return results;
  },
  getLandActive: async (land_id) => {
    const query = `SELECT active FROM land WHERE id_land= ? LIMIT 1;`;
    const results = await getSearchOneDataFromDB(query, land_id);
    return results;
  },
  changeActiveLand: async (landData) => {
    console.log(landData)
    const query = `
    UPDATE land
    SET 
      active = ? 
    WHERE id_land = ?;
  `;
    const results = await updateOneDataToDB(query, landData);
    return results;
  },
};

module.exports = landModel;
