// Model
const {
  relationModel,
  getOneRelationModel,
  createRelationModel,
  updateRelationModel,
  deleteRelationModel,
  getOneRelationActiveModel
} = require("../model/commonModel");
const { getDataAllWithOneFromDB } = require("../config/config_db");

const relationController = async (req, res) => {
  console.log("---------------relation---------------");
  try {
    const results = await relationModel();
    res.json(results);
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

const getRelationController = async (req, res) => {
  const { id } = req.params;
  console.log("getOne:", req.params);

  if (!id) {
    return res.status(400).send({ message: "ID parameter is required" });
  }
  console.log("--------------- Relation get one ---------------");
  try {
    const values = [id];
    console.log("v:", values);
    const results = await getOneRelationModel(values);
    if (results) {
      return res.json({
        success: true,
        data: results,
      });
    } else {
      console.log("ไม่สามารถเพิ่มข้อมูลได้!");
      return res.json({ success: false, message: "ไม่สามารถเพิ่มข้อมูลได้!" });
    }
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

const getRelationActiveCTL = async (req, res) => {
  const { id } = req.params;
  const active = req.body;
  console.log("getOne:", req.params);

  if (!id) {
    return res.status(400).send({ message: "ID parameter is required" });
  }
  console.log("--------------- Relation get one ---------------");
  try {
    const values = [id, active.id];
    console.log("v:", values);
    const results = await getOneRelationActiveModel(values);
    if (results) {
      return res.json({
        success: true,
        data: results,
      });
    } else {
      console.log("ไม่สามารถเพิ่มข้อมูลได้!");
      return res.json({ success: false, message: "ไม่สามารถเพิ่มข้อมูลได้!" });
    }
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

const createRelationController = async (req, res) => {
  const { label } = req.body;
  console.log("--------------- Relation create ---------------");
  try {
    const values = [label];
    console.log("v:", values);
    const results = await createRelationModel(values);
    if (results) {
      return res.json({
        success: true,
        message: "เพิ่มข้อมูลสถานะที่ดินสำเร็จ!",
      });
    } else {
      console.log("ไม่สามารถเพิ่มข้อมูลได้!");
      return res.json({ success: false, message: "ไม่สามารถเพิ่มข้อมูลได้!" });
    }
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

const updateRelationController = async (req, res) => {
  const { label } = req.body; // Access the sent data from the request body
  const id = req.params.id; // Get the ID from the URL

  if (!id) {
    return res.status(400).send({ message: "ID parameter is required" });
  }
  console.log("--------------- relation updateOne ---------------");
  try {
    const values = [label, id];
    console.log(values);
    const results = await updateRelationModel(values);
    if (results) {
      return res.json({
        success: true,
        message: "อัพเดทสำเร็จ!",
      });
    } else {
      console.log("ไม่สามารถอัพเดทข้อมูลได้!");
      return res.json({ success: false, message: "ไม่สามารถอัพเดทข้อมูลได้!" });
    }
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

const deleteRelationController = async (req, res) => {
  const { id } = req.params; // Access 'id' from the query string
  const active = req.body; // Access 'id' from the query string
  console.log("id:", id);
  console.log("active:", active);

  if (!id) {
    return res.status(400).send({ message: "ID parameter is required" });
  }
  console.log("--------------- Relation delete ---------------");

  try {
    const values = [active.id, id];
    console.log('v:',values)
    const results = await deleteRelationModel(values);
    if (results) {
      return res.json({
        success: true,
        message: "ลบข้อมูลสำเร็จ!",
      });
    } else {
      console.log("ไม่สามารถเพิ่มข้อมูลได้!");
      return res.json({ success: false, message: "ไม่สามารถเพิ่มข้อมูลได้!" });
    }
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

const relationWithCitizenCTL = async (req, res) => {
  console.log("req.params:", req.params);
  console.log("---------------relation---------------");
  try {
    const query = `
    SELECT 
    chr.citizen_id,
    h.heir_id,
    CONCAT(p.prefix_name, h.first_name, ' ', h.last_name) AS full_name,  -- Combine first and last names
    chr.relationship_id,
    r.label AS relationship_label  -- Label from 'relations' table
FROM citizen_heir_relationship AS chr
JOIN heir AS h ON chr.heir_id = h.heir_id
LEFT JOIN prefix AS p ON h.prefix_id = p.prefix_id
JOIN relations AS r ON chr.relationship_id = r.id
WHERE chr.citizen_id = ?;
  `;

    // console.log("Executing SQL Query:", query);
    // console.log("With citizen_id:", id);

    const results = await getDataAllWithOneFromDB(query, req.params.id);

    // Check if results are found
    if (results.length > 0) {
      // Send successful response with data
      return res.json({
        status: "success",
        message: `Found ${results.length} heir relationship(s) for citizen ID ${req.params.id}.`,
        data: results,
      });
    } else {
      // If no data found, send an error message
      return res.json({
        status: "error",
        message: `No heir relationships found for citizen ID ${req.params.id}.`,
        data: [],
      });
    }
  } catch (err) {
    // Handle errors and send a failure response
    console.error("Error occurred:", error);
    return res.status(500).json({
      status: "error",
      message: `Error retrieving heir relationships: ${error.message}`,
    });
  }
};

module.exports = {
  relationController,
  getRelationController,
  createRelationController,
  updateRelationController,
  deleteRelationController,
  relationWithCitizenCTL,
  getRelationActiveCTL
};
