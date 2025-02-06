const {
  getDataFromDB,
  insertDataToDB,
  getLikeSearchFromDB,
  getSearchOneDataFromDB,
  getSearchDataFromDB,
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
  ORDER BY created_at DESC
  LIMIT ? OFFSET ?;
    `;
    const results = await getSearchDataFromDB(query, [limit, offset]);
    return {
      results,
      totalCount: parseInt(maxLimitResult.Total), // Include the total row count in the response
    };
  },
};

module.exports = citizenModel;
