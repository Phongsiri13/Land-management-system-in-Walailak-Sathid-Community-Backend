// routes/authRouter.js
const express = require("express");
// const mysql = require('mysql2');
const { getDataFromDB, insertDataToDB, pool } = require("../config/config_db");

const router = express.Router();

router.get("/relation", async (req, res) => {
  try {
    const query = "SELECT * FROM relations";
    const results = await getDataFromDB(query);
    res.json(results);
  } catch (err) {
    console.error("Error executing query: " + err.message);
    return res.status(500).send("Database query error");
  }
});

// -------------------------------------------- Post --------------------------------------------
router.post("/", async (req, res) => {
  const heirData = req.body;
  console.log("heir:", heirData);


  const values_heir = [
    heirData.fname_heir,
    heirData.lname_heir,
    heirData.prefix,
  ];


  let conn;
  // Transaction concept

  // Add data to heir db
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction(); // เริ่มต้น transaction

    const query_heir = `INSERT INTO heir (
      first_name, last_name, prefix_id
    ) VALUES (?, ?, ?)`;
    // Step 1: Insert data to heir db
    const resultsHeir = await conn.query(query_heir, values_heir);

    // Step 2: Get the primary key of the heir
    const queryGetPrimaryKey = `
      SELECT heir_id 
      FROM heir
      WHERE first_name = ? AND last_name = ?;
    `;
    const values_for_key = [ heirData.fname_heir, heirData.lname_heir ];
    const resultsPrimaryKey = await conn.query(
      queryGetPrimaryKey,
      values_for_key
    );    

    console.log('select:',resultsPrimaryKey[0]);

    // Step 3: Add data to citizen_heir_relationship
    const query_relationship = `INSERT INTO citizen_heir_relationship (
      citizen_id, heir_id, relationship_id
    ) VALUES (?, ?, ?)`;
    const values_relationship = [
      heirData.citizen_id,
      resultsPrimaryKey[0].heir_id,
      heirData.relation
    ];
    const resultsRelationship = await conn.query(query_relationship, values_relationship);

    await conn.commit(); // ยืนยัน transaction
    console.log('Transaction completed successfully');
    res.send('Data successfully saved'); // ส่งผลลัพธ์กลับ
  } catch (error) {
    console.error("Error executing query: " + error.message);
    return res.status(500).send("Database query error");
  }
});

// -------------------------------------------- END --------------------------------------------

module.exports = router;
