const {
  getDataFromDB,
  insertDataToDB,
  getLikeSearchFromDB,
  getSearchOneDataFromDB,
  getSearchDataFromDB,
  updateOneDataToDB,
  pool,
} = require("../config/config_db");

const citizenModel = {
  getCitizenById: async (id_card) => {
    const query = `SELECT 
    p.*,  -- Select all columns from citizen
    pf.prefix_name,  -- Select only necessary columns from prefix
    pf.prefix_id AS prefix_table_id  -- Rename prefix_id to avoid duplication
FROM citizen p
JOIN prefix pf ON p.prefix_id = pf.prefix_id
WHERE p.ID_CARD = ?
LIMIT 1;`;
    const results = await getSearchOneDataFromDB(query, id_card);
    return results;
  },

  addCitizen: async (citizenData) => {
    const query = `INSERT INTO citizen (
      ID_CARD, first_name, last_name, prefix_id, birthday, house_number, village_number, district, soi, phone_number, gender
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const results = await insertDataToDB(query, citizenData);
    return results;
  },

  updateCitizenByOne: async (update_data, IDCARD) => {
    const connection = await pool.getConnection(); // ดึง connection สำหรับ transaction

    try {
      await connection.beginTransaction(); // เริ่ม transaction

      // ตรวจสอบว่ามี ID_CARD อยู่ในระบบหรือไม่
      const query_citizen_check = `
    SELECT * FROM citizen WHERE ID_CARD = ? LIMIT 1;
  `;
      const result = await connection.query(query_citizen_check, [IDCARD]);

      if (!result.length) {
        throw new Error("ไม่พบราษฎรคนนี้");
      }

      const historyUpdate = [
        result[0].first_name,
        result[0].last_name,
        result[0].prefix_id,
        result[0].birthday,
        result[0].house_number,
        result[0].village_number,
        result[0].district,
        result[0].phone_number,
        result[0].soi,
        result[0].gender,
        result[0].ID_CARD,
      ];

      console.log("result:", result);

      // อัปเดตข้อมูลราษฎร
      const query_update = `
    UPDATE citizen 
    SET 
        first_name = ?, 
        last_name = ?, 
        prefix_id = ?, 
        birthday = ?, 
        house_number = ?, 
        village_number = ?, 
        district = ?, 
        phone_number = ?, 
        soi = ?, 
        gender = ? 
    WHERE ID_CARD = ?;
  `;

      await connection.query(query_update, update_data);

      // บันทึกข้อมูลลงในประวัติ (insert ค่าก่อนอัปเดตเก็บไว้)
      const query_history = `
    INSERT INTO history_citizen (
        first_name, 
        last_name, 
        prefix_id, 
        birthday, 
        house_number, 
        village_number, 
        district, 
        phone_number, 
        soi, 
        gender,
        CARD_ID
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

      await connection.query(query_history, historyUpdate);

      await connection.commit(); // ยืนยัน transaction
      return {
        success: true,
        message: "อัปเดตข้อมูลสำเร็จและบันทึกประวัติแล้ว",
      };
    } catch (error) {
      await connection.rollback(); // ยกเลิก transaction ถ้ามีข้อผิดพลาด
      console.error("Transaction error:", error);
      throw error;
    } finally {
      connection.release(); // ปล่อย connection กลับไปที่ pool
    }
  },

  citizenAmountPage: async (page, size) => {
    const routePage = parseInt(page);
    const limit = parseInt(size); // จำนวนข้อมูลต่อหน้า (default = 10)
    const offset = (routePage - 1) * size; // คำนวณตำแหน่งเริ่มต้นของข้อมูล

    // Query the database to get the maximum allowed limit
    const maxLimitQuery = `SELECT COUNT(ID_CARD) as Total FROM citizen;`;
    const [maxLimitResult] = await getSearchDataFromDB(maxLimitQuery);
    // console.log("max:", parseInt(maxLimitResult.Total));

    const query = `
SELECT * FROM citizen
  ORDER BY soi 
  LIMIT ? OFFSET ?;
    `;
    const results = await getSearchDataFromDB(query, [limit, offset]);
    return {
      results,
      totalCount: parseInt(maxLimitResult.Total), // Include the total row count in the response
    };
  },

  citizenHistoryAmountPage: async (page, size) => {
    const routePage = parseInt(page);
    const limit = parseInt(size); // จำนวนข้อมูลต่อหน้า (default = 10)
    const offset = (routePage - 1) * size; // คำนวณตำแหน่งเริ่มต้นของข้อมูล

    // Query the database to get the maximum allowed limit
    const maxLimitQuery = `SELECT COUNT(CARD_ID) as Total FROM history_citizen;`;
    const [maxLimitResult] = await getSearchDataFromDB(maxLimitQuery);
    // console.log("max:", parseInt(maxLimitResult.Total));

    const query = `
SELECT * FROM history_citizen
  ORDER BY id_h_citizen DESC
  LIMIT ? OFFSET ?;
    `;
    const results = await getSearchDataFromDB(query, [limit, offset]);
    return {
      results,
      totalCount: parseInt(maxLimitResult.Total), // Include the total row count in the response
    };
  },

  getFullnameCitizen: async (fullname) => {
    const query = `SELECT ID_CARD, first_name, last_name FROM citizen WHERE first_name = ? AND last_name = ? LIMIT 1`;
    const resultsHeir = await getSearchDataFromDB(query, fullname);

    if (resultsHeir.length > 0) {
      return resultsHeir; // If there are matching heirs, return true
    } else {
      return false; // If no match is found, return false
    }
  },

  getCitizenLandHold: async (id_card) => {
    const query = `
    SELECT citizen.ID_CARD, 
           land.number,
           land.id_land,
           SUM(COALESCE(land.rai, 0)) 
           + (SUM(COALESCE(land.ngan, 0)) / 4) 
           + (SUM(COALESCE(land.square_wa, 0)) / 400) AS total_area_in_rai
    FROM citizen 
    JOIN land ON citizen.ID_CARD = land.id_card
    WHERE land.id_card = ?
    GROUP BY citizen.ID_CARD, land.id_land;
`;
    const resultsHeir = await getSearchDataFromDB(query, id_card);

    if (resultsHeir.length > 0) {
      return resultsHeir; // If there are matching heirs, return true
    } else {
      return false; // If no match is found, return false
    }
  },
};

module.exports = citizenModel;
