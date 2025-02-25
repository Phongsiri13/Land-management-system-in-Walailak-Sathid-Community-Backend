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
  ORDER BY l.current_soi
  LIMIT ? OFFSET ?;
    `;
    const results = await getSearchDataFromDB(query, [limit, offset]);
    return results;
  },
  landHistoryAmountPage: async (page, size) => {
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
    l.id_h_land,
    land_status_name, 
    l.land_id, 
    l.current_soi,
    l.current_land_status, 
    l.number, 
    l.active,
    p.phone_number
  FROM history_land as l
  LEFT JOIN citizen p ON l.id_card = p.ID_CARD
  LEFT JOIN prefix pr ON p.prefix_id = pr.prefix_id
  LEFT JOIN land_status ls ON l.current_land_status = ls.ID_land_status
  ORDER BY l.id_h_land DESC
  LIMIT ? OFFSET ?;`;
    const results = await getSearchDataFromDB(query, [limit, offset]);
    return results;
  },
  landHistoryLandHistoryOneCompare: async (land_h_id) => {
    const query = `
   SELECT 
    *
FROM 
    history_land AS hl
JOIN 
    land_status AS ls
    ON hl.current_land_status = ls.ID_land_status
    WHERE hl.id_h_land = ?;`;

    const results_history = await getSearchDataFromDB(query, land_h_id);
    console.log(results_history[0].land_id)
    const query_current_land = `
    SELECT 
        *
      FROM land
      JOIN
      land_status AS ls
      ON land.current_land_status = ls.ID_land_status
      WHERE id_land = ? LIMIT 1;`;
    const LAND_ID = results_history[0].land_id
    const results_land = await getSearchDataFromDB(query_current_land, LAND_ID);
    return {results_history, results_land};
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
  updateLandOne: async (landData, IDLAND) => {
    const connection = await pool.getConnection(); // ดึง Connection จาก Pool
    await connection.beginTransaction(); // เริ่ม Transaction

    try {
      const query_citizen_check = `
    SELECT * FROM land WHERE id_land = ? LIMIT 1;
  `;
      const result = await connection.query(query_citizen_check, [IDLAND]);

      if (!result.length) {
        throw new Error("ไม่พบที่ดินนี้");
      }

      const historyLand = [
        result[0].id_land,
        result[0].number,
        result[0].volume,
        result[0].tf_number,
        result[0].spk_area,
        result[0].l_house_number,
        result[0].current_soi,
        result[0].rai,
        result[0].ngan,
        result[0].square_wa,
        result[0].l_district,
        result[0].l_village_number,
        result[0].notation,
        result[0].current_land_status,
        result[0].id_card,
        result[0].long,
        result[0].lat,
      ];

      // อัปเดตข้อมูลแปลงที่ดินเดิม
      await connection.execute(
        `UPDATE land
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
      WHERE id_land = ?;`,
        landData
      );

      // เพิ่มข้อมูลลงตารางประวัติ (`land` หรือควรสร้าง `land_history`)
      await connection.execute(
        `INSERT INTO history_land (
            land_id, 
            number, 
            volume, 
            tf_number, 
            spk_area, 
            l_house_number, 
            current_soi, 
            rai, 
            ngan, 
            square_wa, 
            l_district, 
            l_village_number, 
            notation, 
            current_land_status, 
            id_card, 
            \`long\`, 
            \`lat\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        historyLand
      );

      await connection.commit(); // บันทึก Transaction
      return { success: true, message: "Transaction successful" };
    } catch (error) {
      await connection.rollback(); // ย้อนกลับการเปลี่ยนแปลงเมื่อเกิดข้อผิดพลาด
      console.error("Transaction failed:", error); // บันทึกข้อผิดพลาด
      throw error; // ส่งต่อข้อผิดพลาด
    } finally {
      connection.release(); // คืน Connection กลับ Pool
    }
  },
  updateLandUseOne: async (landData) => {
    // console.log("land_use:", landData);
    const query = `
    UPDATE land_use
    SET 
      rubber_tree = ?, 
      fruit_orchard = ?, 
      livestock_farming = ?, 
      other = ?, 
      details = ?
    WHERE land_id = ? AND land_use_id = ?;
  `;
    const results = await updateOneDataToDB(query, landData);
    return results;
  },
  getLandActive: async (land_id) => {
    const query = `SELECT active FROM land WHERE id_land= ? LIMIT 1;`;
    const results = await getSearchOneDataFromDB(query, land_id);
    return results;
  },
  changeActiveLand: async (landData, IDLAND) => {
    const connection = await pool.getConnection(); // ดึง Connection จาก Pool
    await connection.beginTransaction(); // เริ่ม Transaction

    try {
      console.log(landData);

      // ตรวจสอบว่าที่ดินมีอยู่จริง
      const query_citizen_check = `
        SELECT * FROM land WHERE id_land = ? LIMIT 1;
      `;
      const [result] = await connection.query(query_citizen_check, [IDLAND]);

      if (result.length === 0) {
        throw new Error("ไม่พบที่ดินนี้"); // Throw error หากไม่พบที่ดิน
      }

      console.log("result:", result);
      const historyLand = [
        result.id_land,
        result.number,
        result.volume,
        result.tf_number,
        result.spk_area,
        result.l_house_number,
        result.current_soi,
        result.rai,
        result.ngan,
        result.square_wa,
        result.l_district,
        result.l_village_number,
        result.notation,
        result.current_land_status,
        result.id_card,
        result.long,
        result.lat,
        result.active,
      ];

      // อัปเดตสถานะ active ของที่ดิน
      const query = `
        UPDATE land
        SET 
          active = ? 
        WHERE id_land = ?;
      `;
      await connection.execute(query, landData);

      await connection.execute(
        `INSERT INTO history_land (
            land_id, 
            number, 
            volume, 
            tf_number, 
            spk_area, 
            l_house_number, 
            current_soi, 
            rai, 
            ngan, 
            square_wa, 
            l_district, 
            l_village_number, 
            notation, 
            current_land_status, 
            id_card, 
            \`long\`, 
            \`lat\`,
            active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        historyLand
      );

      await connection.commit(); // บันทึก Transaction
      return { success: true, message: "อัปเดตสถานะที่ดินสำเร็จ" };
    } catch (error) {
      await connection.rollback(); // ยกเลิกการเปลี่ยนแปลงทั้งหมด
      console.error("เกิดข้อผิดพลาดในการอัปเดตสถานะที่ดิน:", error);
      throw error; // ส่งต่อข้อผิดพลาด
    } finally {
      connection.release(); // คืน Connection กลับ Pool
    }
  },
  getAllLiveFileByID: async (land_id) => {
    const query = `SELECT * FROM document_lives WHERE doc_land_id= ? ORDER BY id_live_doc DESC ;`;
    const results = await getSearchOneDataFromDB(query, land_id);
    return results;
  },
};

module.exports = landModel;
