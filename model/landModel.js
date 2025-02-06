const {
  getDataFromDB,
  insertDataToDB,
  getLikeSearchFromDB,
  getSearchDataFromDB,
  getSearchOneDataFromDB,
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
    const query = `
    INSERT INTO land (
      tf_number, spk_area, number, volume, l_house_number, current_soi, 
      rai, ngan, square_wa, l_district, l_village_number, notation, 
      current_land_status, id_card, \`long\`, \`lat\`, active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const results = await insertDataToDB(query, landData);
    return results;
  },
};

module.exports = landModel;
