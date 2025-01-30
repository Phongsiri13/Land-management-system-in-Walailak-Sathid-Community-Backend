// routes/authRouter.js
const express = require("express");
const {
  getDataFromDB,
  insertDataToDB,
  getLikeSearchFromDB,
} = require("../config/config_db");
const citizenController = require('../controllers/citizen_controller')
const {prefixesController} = require('../controllers/prefix_controller')

const router = express.Router();

// -------------------------------------------- GET --------------------------------------------

router.get("/", (req, res) => {
  res.send("People page");
});

// ค้นหาข้อมูลโดยใช้ LIKE
router.get("/search", async (req, res) => {
  let searchTerm = req.query.firstname; // รับค่าจาก query string
  // let searchLastName = req.query.lastname || ''; // รับค่าจาก query string
	// searchTerm = searchTerm ? searchTerm.replace(/"/g, "'"):'';
  // console.log("search-term", searchTerm);)

  if (!searchTerm) {
    return res.status(400).send("Please provide a name to search.");
  }
	const query = `SELECT ID_CARD, first_name, last_name FROM people WHERE first_name LIKE ${searchTerm}'%'`;
	// const query = `SELECT ID_CARD, first_name, last_name FROM people WHERE first_name LIKE ${searchTerm}`; // can use 
	const values = [searchTerm]; // ส่งค่า searchTerm ที่ไม่มีเครื่องหมายคำพูด
  // return res.send("search:" + searchTerm); // debug
  console.log("search-term", query);
  try {
    const results = await getLikeSearchFromDB(query, values);
    if (results.length > 0) {
      return res.json(results); // ส่งผลลัพธ์เป็น JSON
    } else {
      return res.status(404).send("No records found.");
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Internal server error.");
  }
});

router.get("/prefix", prefixesController)

router.get("/:id_card", (req, res) => {
  const idCard = req.params.id_card;
  connection.query(
    `SELECT first_name, last_name, prefix_name
FROM people p
JOIN prefix pf ON p.prefix_id = pf.prefix_id
WHERE p.ID_CARD = ?;
`,
    [idCard],
    (err, results) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return res.status(500).send("Database query error");
      }

      if (results.length > 0) {
        // ส่งข้อมูลที่พบกลับไป
        res.json(results[0]);
      } else {
        // ถ้าไม่พบข้อมูล
        res.status(404).send("No data found for the given ID card");
      }
    }
  );
});

// -------------------------------------------- END --------------------------------------------

// -------------------------------------------- Post --------------------------------------------

// For adding a citizen
router.post("/", citizenController.addCitizenController);

// -------------------------------------------- END --------------------------------------------

module.exports = router;
