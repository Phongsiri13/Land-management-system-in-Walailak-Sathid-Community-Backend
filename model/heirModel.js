const {
  getDataFromDB,
  insertDataToDB,
  getLikeSearchFromDB,
} = require("../config/config_db");

const heirModel = {
  getHeirById: async (id_card) => {},

  addHeir: async (heirData) => {
    const query_heir = `INSERT INTO heir (
      first_name, last_name, prefix_id
    ) VALUES (?, ?, ?)`;
    // Step 1: Insert data to heir db
    const resultsHeir = await insertDataToDB(query_heir, heirData);
    return resultsHeir;
  },
};

module.exports = heirModel;
