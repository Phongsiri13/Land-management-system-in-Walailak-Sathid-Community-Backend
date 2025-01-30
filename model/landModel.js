const {
  getDataFromDB,
  insertDataToDB,
  getLikeSearchFromDB,
} = require("../config/config_db");

const landModel = {
  getlandById: async (id_card) => {},

  addLand: async (landData) => {
    const query = `
    INSERT INTO land (
      tf_number, spk_area, number, volume, l_house_number, current_soi, 
      rai, ngan, square_wa, l_district, l_village_number, notation, 
      current_land_status, id_card
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const results = await insertDataToDB(query, landData);
    return results;
  },
};

module.exports = landModel;
