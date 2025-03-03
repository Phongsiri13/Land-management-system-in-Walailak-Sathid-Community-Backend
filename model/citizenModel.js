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

  citizenAmountPage: async (page, size, filters = {}) => {
    const routePage = parseInt(page);
    const limit = parseInt(size); // จำนวนข้อมูลต่อหน้า
    const offset = (routePage - 1) * size; // คำนวณตำแหน่งเริ่มต้นของข้อมูล
    let { searchType, searchQuery, soi, district } = filters;

    // สร้างเงื่อนไข WHERE สำหรับการกรองข้อมูล
    let whereClause = "WHERE 1=1";
    const params = [];

    if (searchQuery && searchType) {
      if (searchType === "NAME") {
        // เพิ่ม wildcard สำหรับ LIKE
        const keywordWithSpace = `%${searchQuery}%`; // ค้นหาชื่อที่มีช่องว่าง
        const keywordWithoutSpace = `%${searchQuery.replace(/\s/g, "")}%`; // ค้นหาชื่อที่ไม่มีช่องว่าง

        whereClause += `
                AND (
                    first_name LIKE ? 
                    OR last_name LIKE ? 
                    OR CONCAT(first_name, ' ', last_name) LIKE ?
                    OR REPLACE(CONCAT(first_name, ' ', last_name), ' ', '') LIKE ?
                )`;

        // เพิ่มค่าที่กรองใน params
        params.push(
          keywordWithSpace, // first_name
          keywordWithSpace, // last_name
          keywordWithSpace, // CONCAT(first_name, ' ', last_name)
          keywordWithoutSpace // REPLACE(CONCAT(first_name, ' ', last_name), ' ', '')
        );
      } else if (searchType === "PHONE") {
        whereClause += ` AND phone_number = ?`;
        params.push(searchQuery);
      } else if (searchType === "IDCARD") {
        whereClause += ` AND ID_CARD = ?`;
        params.push(searchQuery);
      }
    }

    if (soi) {
      whereClause += ` AND soi = ?`;
      params.push(soi);
    }

    if (district) {
      whereClause += ` AND district = ?`;
      // เปลี่ยนค่าจาก district ตามที่กำหนด
      if (district === "Huataphan") {
        params.push("หัวตะพาน");
      } else if (district === "Taiburi") {
        params.push("ไทรบุรี");
      } else {
        params.push(district); // สำหรับเขตที่ไม่ตรงกับเงื่อนไขที่กำหนด
      }
    }

    // Query เพื่อนับจำนวนข้อมูลทั้งหมดหลังกรอง
    const maxLimitQuery = `
        SELECT COUNT(ID_CARD) as Total 
        FROM citizen
        ${whereClause};
    `;
    const [maxLimitResult] = await getSearchDataFromDB(maxLimitQuery, params);

    // Query เพื่อดึงข้อมูลที่กรองแล้ว
    const query = `
        SELECT * 
        FROM citizen
        ${whereClause}
        ORDER BY soi
        LIMIT ? OFFSET ?;
    `;
    const results = await getSearchDataFromDB(query, [
      ...params,
      limit,
      offset,
    ]);

    return {
      results,
      totalCount: parseInt(maxLimitResult.Total), // จำนวนข้อมูลทั้งหมดหลังกรอง
    };
  },

  citizenFilterAmountPage: async (queryList, page, size, filter_type) => {
    const { searchType, searchQuery } = filter_type;
    const routePage = parseInt(page);
    const limit = parseInt(size); // จำนวนข้อมูลต่อหน้า (default = 10)
    const offset = (routePage - 1) * size; // คำนวณตำแหน่งเริ่มต้นของข้อมูล
    console.log("lll:", queryList);
    // แปลง keyword สำหรับการค้นหา
    const keyword = searchQuery; // คีย์เวิร์ดที่ผู้ใช้ป้อน (อาจมีหรือไม่มีช่องว่
    const keywordWithSpace = `%${keyword}%`; // สำหรับค้นหาแบบมีช่องว่าง
    const keywordWithoutSpace = `%${keyword.replace(/\s/g, "")}%`; // สำหรับค้นหาแบบไม่มีช่องว่าง

    let query;
    let params;

    switch (searchType) {
      case "NAME": // ค้นหาด้วยชื่อ
        query = `
        SELECT * FROM citizen AS ct
        WHERE 
          ct.first_name LIKE ? OR 
          ct.last_name LIKE ? OR 
          CONCAT(ct.first_name, ' ', ct.last_name) LIKE ? OR 
          REPLACE(CONCAT(ct.first_name, ' ', ct.last_name), ' ', '') LIKE ?
        ORDER BY ct.soi
        LIMIT ? OFFSET ?;
      `;
        params = [
          keywordWithSpace,
          keywordWithSpace,
          keywordWithSpace,
          keywordWithoutSpace,
          limit,
          offset,
        ];
        break;

      case "PHONE": // ค้นหาด้วยเบอร์โทรศัพท์
        query = `
          SELECT * FROM citizen AS ct
          WHERE ct.phone_number = ?
          LIMIT 1;
        `;
        params = [searchQuery];
        break;

      case "IDCARD": // ค้นหาด้วยบัตรประชาชน
        query = `
          SELECT * FROM citizen AS ct
          WHERE ct.ID_CARD = ?
          LIMIT 1;
        `;
        params = [searchQuery];
        break;

      default:
        return res.status(400).json({ error: "Invalid search type" });
    }

    //   const query_citizen = `
    //   SELECT * FROM citizen AS ct
    //   WHERE
    //     ct.first_name LIKE ? OR
    //     ct.last_name LIKE ? OR
    //     CONCAT(ct.first_name, ' ', ct.last_name) LIKE ? OR
    //     REPLACE(CONCAT(ct.first_name, ' ', ct.last_name), ' ', '') LIKE ?
    //   ORDER BY ct.soi
    //   LIMIT ? OFFSET ?;
    // `;

    const results = await getSearchDataFromDB(query, params);
    // const results = await getSearchDataFromDB(query_citizen, [
    //   keywordWithSpace,
    //   keywordWithSpace,
    //   keywordWithSpace,
    //   keywordWithoutSpace,
    //   limit,
    //   offset,
    // ]);

    // Query สำหรับนับจำนวนผลลัพธ์ทั้งหมด
    const countQuery = `
  SELECT COUNT(*) AS total_count FROM citizen AS ct
  WHERE 
    ct.first_name LIKE ? OR 
    ct.last_name LIKE ? OR 
    CONCAT(ct.first_name, ' ', ct.last_name) LIKE ? OR 
    REPLACE(CONCAT(ct.first_name, ' ', ct.last_name), ' ', '') LIKE ?;
`;

    let totalCount = 0;
    if (searchType == "NAME") {
      // เรียกใช้ query สำหรับนับจำนวนผลลัพธ์ทั้งหมด
      const countParams = [
        keywordWithSpace,
        keywordWithSpace,
        keywordWithSpace,
        keywordWithoutSpace,
      ];
      const totalCountResult = await getSearchDataFromDB(
        countQuery,
        countParams
      );
      totalCount = totalCountResult[0].total_count.toString(); // แปลง BigInt เป็น String
    }

    return {
      results,
      totalCount,
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
           land.tf_number,
           land.id_land,
           land.rai,
           land.ngan,
           land.square_wa
    FROM citizen 
    JOIN land ON citizen.ID_CARD = land.id_card
    WHERE land.id_card = ?
    GROUP BY citizen.ID_CARD, land.id_land;
`;
    const resultsCitizen = await getSearchDataFromDB(query, [id_card]);

    return resultsCitizen;
  },

  getOneCitizenHistory: async (id_card) => {
    const query_current_history = `
SELECT hc.*, COALESCE(prefix.prefix_name, 'N/A') AS prefix_name
FROM history_citizen as hc
LEFT JOIN prefix ON hc.prefix_id = prefix.prefix_id
WHERE hc.id_h_citizen = ?
LIMIT 1;
`;

    const query = `
SELECT citizen.*, COALESCE(prefix.prefix_name, 'N/A') AS prefix_name
FROM citizen
LEFT JOIN prefix ON citizen.prefix_id = prefix.prefix_id
WHERE citizen.ID_CARD = ?
LIMIT 1;
`;

    console.log("query:", query_current_history);
    const resultsHistoryCitizen = await getSearchDataFromDB(
      query_current_history,
      id_card
    );
    const IDCARD = resultsHistoryCitizen[0].CARD_ID;
    const resultsCitizen = await getSearchDataFromDB(query, IDCARD);
    console.log(resultsHistoryCitizen[0].CARD_ID);

    return { resultsHistoryCitizen, resultsCitizen };
  },
};

module.exports = citizenModel;
