const {
  getDataAllFromDB,
  insertDataToDB,
  removeDataToDB,
  getSearchOneDataFromDB,
  updateOneDataToDB
} = require("../config/config_db");

const prefixModel = async () => {
  const query = "SELECT * FROM prefix";
  const results = await getDataAllFromDB(query);
  return results;
};

// --------------------------------------- Start point statusLand ---------------------------------------
const getOneLandUse = async (land_id) => {
  const query = `SELECT * FROM land_use WHERE land_id = ?;`;
  const results = await getSearchOneDataFromDB(query, land_id);
  return results;
};

// --------------------------------------- end relation ---------------------------------------

// --------------------------------------- Start point relation ---------------------------------------

const relationModel = async () => {
  const query = "SELECT * FROM relations";
  const results = await getDataAllFromDB(query);
  console.log(results);
  return results;
};

const getOneRelationModel = async (status_id) => {
  const query = `SELECT * FROM relations WHERE id = ?;`;
  const results = await getSearchOneDataFromDB(query, status_id);
  return results;
};

const createRelationModel = async (status_data) => {
  console.log(status_data);
  const query = `
  INSERT INTO relations (label) 
  VALUES (?);`;
  const results = await insertDataToDB(query, status_data);
  return results;
};

const updateRelationModel = async (values) => {
  const query = `UPDATE relations 
    SET label = ? 
    WHERE id = ?;`;
  const results = await updateOneDataToDB(query, values);
  return results;
};

const deleteRelationModel = async (status_id) => {
  const query = `DELETE FROM relations WHERE id = ?;`;
  const results = await removeDataToDB(query, status_id);
  return results;
};

// --------------------------------------- end relation ---------------------------------------

// --------------------------------------- Start point statusLand ---------------------------------------

const landStatusModel = async () => {
  const query = "SELECT * FROM land_status ORDER BY ID_land_status";
  const results = await getDataAllFromDB(query);
  return results;
};

const createStatusModel = async (status_data) => {
  console.log(status_data);
  const query = `
  INSERT INTO land_status (land_status_name) 
  VALUES (?);`;
  const results = await insertDataToDB(query, status_data);
  return results;
};

const getOneStatusModel = async (status_id) => {
  const query = `SELECT * FROM land_status WHERE ID_land_status = ?;`;
  const results = await getSearchOneDataFromDB(query, status_id);
  return results;
};

const deleteStatusModel = async (status_id) => {
  const query = `DELETE FROM land_status WHERE ID_land_status = ?;`;
  const results = await removeDataToDB(query, status_id);
  return results;
};

const updateOneStatusModel = async (values) => {
  const query = `UPDATE land_status 
    SET land_status_name = ? 
    WHERE ID_land_status = ?;`;
  const results = await updateOneDataToDB(query, values);
  return results;
};

// --------------------------------------- end statusLand ---------------------------------------

// --------------------------------------- Start point DocumentLandType ---------------------------------------

const dcLandTypeModel = async () => {
  const query = "SELECT * FROM document_type ORDER BY ID_dc_type";
  const results = await getDataAllFromDB(query);
  return results;
};

const getOneDcLandTypeModel = async (status_id) => {
  const query = `SELECT * FROM document_type WHERE ID_dc_type = ?;`;
  const results = await getSearchOneDataFromDB(query, status_id);
  return results;
};

const createDcLandTypeModel = async (status_data) => {
  console.log(status_data);
  const query = `
  INSERT INTO document_type (dc_type_name) 
  VALUES (?);`;
  const results = await insertDataToDB(query, status_data);
  return results;
};

const deleteDcLandTypeModel = async (status_id) => {
  const query = `DELETE FROM document_type WHERE ID_dc_type = ?;`;
  const results = await removeDataToDB(query, status_id);
  return results;
};

const updateDcLandTypeModel = async (values) => {
  const query = `UPDATE document_type 
    SET dc_type_name = ? 
    WHERE ID_dc_type = ?;`;
  const results = await updateOneDataToDB(query, values);
  return results;
};

// --------------------------------------- End DocumentLandType ---------------------------------------

const soiModel = async () => {
  const query = "SELECT id_alley FROM alley";
  const results = await getDataAllFromDB(query);
  return results;
};

module.exports = {
  prefixModel,
  relationModel,
  landStatusModel,
  soiModel,
  createStatusModel,
  deleteStatusModel,
  getOneStatusModel,
  updateOneStatusModel,
  dcLandTypeModel,
  getOneDcLandTypeModel,
  createDcLandTypeModel,
  deleteDcLandTypeModel,
  updateDcLandTypeModel,
  getOneRelationModel,
  createRelationModel,
  updateRelationModel,
  deleteRelationModel,
  getOneLandUse
};
