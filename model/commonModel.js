const {
  getDataFromDB,
} = require("../config/config_db");

const prefixModel = async () => {
  const query = "SELECT * FROM prefix";
  const results = await getDataFromDB(query);
  return results
};

const relationModel = async () => {
  const query = "SELECT * FROM relations";
  const results = await getDataFromDB(query);
  return results
};

const landStatusModel = async () => {
  const query = "SELECT * FROM land_status ORDER BY ID_land_status";
  const results = await getDataFromDB(query);
  return results
};

const soiModel = async () => {
  const query = "SELECT id_alley FROM alley";
  const results = await getDataFromDB(query);
  return results
};

module.exports = { prefixModel, relationModel, landStatusModel, soiModel};