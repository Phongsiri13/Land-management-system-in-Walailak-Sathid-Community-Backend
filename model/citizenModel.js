const {
  getDataFromDB,
  insertDataToDB,
  getLikeSearchFromDB,
} = require("../config/config_db");

const citizenModel = {
  getCitizenById: async (id_card) => {

  },

  addCitizen: async (citizenData) => {
    const query = `INSERT INTO people (
      ID_CARD, first_name, last_name, prefix_id, birthday, house_number, village_number, district, soi, phone_number, gender
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const results = await insertDataToDB(query, citizenData);
    return results;
  },
};

module.exports = citizenModel;
