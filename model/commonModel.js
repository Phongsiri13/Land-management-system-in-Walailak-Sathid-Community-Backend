const {
  getDataAllFromDB,
  insertDataToDB,
  removeDataToDB,
  getSearchOneDataFromDB,
  updateOneDataToDB,
  getDataAllWithOneFromDB,
} = require("../config/config_db");

const prefixModel = async () => {
  const query = "SELECT * FROM prefix";
  const results = await getDataAllFromDB(query);
  return results;
};

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

const getOneRelationActiveModel = async (status_id) => {
  const query = `SELECT * FROM relations WHERE actived = ?;`;
  const results = await getSearchOneDataFromDB(query, status_id);
  return results;
};

const createRelationModel = async (relation_data) => {
  console.log(relation_data);
  const query = `
  INSERT INTO relations (label) 
  VALUES (?);`;
  const results = await insertDataToDB(query, relation_data);
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
  const query = `UPDATE relations
  SET actived = ?
  WHERE id = ?;
    `;
  const results = await updateOneDataToDB(query, status_id);
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

const getOneStatusActiveModel = async (status_id) => {
  console.log("active:", status_id);
  const query = `SELECT * FROM land_status WHERE actived = ?;`;
  const results = await getSearchOneDataFromDB(query, status_id);
  return results;
};

const deleteStatusModel = async (status_id) => {
  console.log("status_id:", status_id);
  const query = `UPDATE land_status
SET actived = ?
WHERE ID_land_status = ?;`;
  const results = await updateOneDataToDB(query, status_id);
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

// --------------------------------------- Start dashboard ---------------------------------------
const getDashboardModel = async () => {
  const query = `
SELECT 
    lu.usage_id, 
    CAST(COUNT(lu.usage_id) AS SIGNED) AS count
FROM land
JOIN land_land_usage AS lu ON land.id_land = lu.land_ID
WHERE land.active = '1'
GROUP BY lu.usage_id;
`;

  const results = await getDataAllFromDB(query);

  return results;
};

const getDashboardTableModel = async () => {
  const query_land = `
SELECT 
  land.current_soi,
  land.rai, 
  land.ngan,
  land.square_wa,
  SUM(CASE WHEN land.current_land_status = 'LS01' THEN 1 ELSE 0 END) AS current_land_status01,
  SUM(CASE WHEN land.current_land_status = 'LS02' THEN 1 ELSE 0 END) AS current_land_status02,
  SUM(CASE WHEN land.current_land_status = 'LS03' THEN 1 ELSE 0 END) AS current_land_status03,
  SUM(CASE WHEN land.current_land_status = 'LS04' THEN 1 ELSE 0 END) AS current_land_status04,
  SUM(CASE WHEN land.current_land_status = 'LS01' THEN 1 ELSE 0 END) 
    + SUM(CASE WHEN land.current_land_status = 'LS02' THEN 1 ELSE 0 END) 
    + SUM(CASE WHEN land.current_land_status = 'LS03' THEN 1 ELSE 0 END) 
    + SUM(CASE WHEN land.current_land_status = 'LS04' THEN 1 ELSE 0 END) AS total_land_status_count
FROM land
JOIN land_status ON land_status.ID_land_status = land.current_land_status
GROUP BY land.current_soi
ORDER BY land.current_soi;
`;

  const results = await getDataAllFromDB(query_land);
  return results;
};

const getDashboardCitizenTableModel = async () => {
  const query_citizen = `
  SELECT 
    ct.soi,
    SUM(CASE WHEN ct.district = 'หัวตะพาน' THEN 1 ELSE 0 END) 
      + SUM(CASE WHEN ct.district = 'ไทยบุรี' THEN 1 ELSE 0 END) AS total_citizens,  -- นับจำนวนราษฎรทั้งหมดในแต่ละ soi
    SUM(CASE WHEN ct.district = 'หัวตะพาน' THEN 1 ELSE 0 END) AS huataphan,
    SUM(CASE WHEN ct.district = 'ไทยบุรี' THEN 1 ELSE 0 END) AS taiburi,
    SUM(CASE WHEN ct.gender = '1' THEN 1 ELSE 0 END) AS male,
    SUM(CASE WHEN ct.gender = '0' THEN 1 ELSE 0 END) AS female
  FROM citizen as ct
  GROUP BY ct.soi
  ORDER BY ct.soi;
  `;

  const results = await getDataAllFromDB(query_citizen);
  return results;
};

const getOneDashboardModel = async (soi) => {
  let query;
  let params = [];

  if (soi === -1) {
    // ไม่กรอง `land.current_soi`
    query = `
    SELECT 
        lu.usage_id, 
        CAST(COUNT(lu.usage_id) AS SIGNED) AS count
    FROM land
    JOIN land_land_usage AS lu ON land.id_land = lu.land_ID
    WHERE land.active = '1' 
    AND (land.current_land_status = 'LS01' OR land.current_land_status = 'LS02') 
    GROUP BY lu.usage_id;
    `;
  } else {
    // กรองตาม `soi`
    query = `
    SELECT 
        lu.usage_id, 
        CAST(COUNT(lu.usage_id) AS SIGNED) AS count
    FROM land
    JOIN land_land_usage AS lu ON land.id_land = lu.land_ID
    WHERE land.active = '1' 
    AND land.current_soi = ? 
    AND (land.current_land_status = 'LS01' OR land.current_land_status = 'LS02') 
    GROUP BY lu.usage_id;
    `;
    params.push(soi); // เพิ่ม `soi` เป็นพารามิเตอร์ใน query
  }

  console.log("test:", soi);
  const results = await getDataAllWithOneFromDB(query, params);
  console.log(results);
  return results;
};

// --------------------------------------- End DocumentLandType ---------------------------------------

// --------------------------------------- Start point land usage ---------------------------------------

// ไม่ใช้แล้ว
const getOneLandUse = async (land_id) => {
  const query = `SELECT * FROM land_use WHERE land_id = ?;`;
  const results = await getSearchOneDataFromDB(query, land_id);
  return results;
};

const getOneLandUseModelV2 = async (land_id) => {
  const query = `SELECT * FROM land_land_usage WHERE land_ID = ?;`;
  const results = await getSearchOneDataFromDB(query, land_id);
  return results;
};

const landUsageModel = async () => {
  const query = "SELECT * FROM land_usage ORDER BY id_usage";
  const results = await getDataAllFromDB(query);
  return results;
};

const getOneLandUsageModel = async (id_landUsage) => {
  const query = "SELECT * FROM land_usage WHERE id_usage = ?;";
  console.log("id_landUsage:", id_landUsage);
  const results = await getSearchOneDataFromDB(query, [id_landUsage]); // ✅ ใช้ array
  return results;
};

const getOneLandUsageActiveModel = async (status_id) => {
  console.log("active:", status_id);
  const query = `SELECT * FROM land_usage WHERE actived = ?;`;
  const results = await getSearchOneDataFromDB(query, status_id);
  return results;
};

const updateOneLandUsageModel = async (values) => {
  const query = `UPDATE land_usage 
    SET land_usage_name = ? 
    WHERE id_usage = ?;`;
  const results = await updateOneDataToDB(query, values);
  return results;
};

const createLandUsageModel = async (land_usage_name) => {
  console.log("land_usage_name:", land_usage_name);
  const query = `
  INSERT INTO land_usage (land_usage_name) 
  VALUES (?);`;
  const results = await insertDataToDB(query, [land_usage_name]);
  return results;
};

const deleteLandUsageModel = async (land_usage_data) => {
  const query = `UPDATE land_usage 
    SET actived = ? 
    WHERE id_usage = ?;`;
  const results = await updateOneDataToDB(query, land_usage_data);
  return results;
};

// --------------------------------------- end land usage ---------------------------------------

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
  getOneLandUse,
  getOneStatusActiveModel,
  getOneRelationActiveModel,
  getDashboardModel,
  getOneDashboardModel,
  getDashboardTableModel,
  getDashboardCitizenTableModel,
  landUsageModel,
  getOneLandUsageModel,
  updateOneLandUsageModel,
  getOneLandUsageActiveModel,
  getOneLandUseModelV2,
  createLandUsageModel,
  deleteLandUsageModel,
};
