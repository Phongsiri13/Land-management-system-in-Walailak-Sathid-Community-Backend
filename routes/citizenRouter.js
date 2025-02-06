// routes/authRouter.js
const express = require("express");
const {
  getDataFromDB,
  insertDataToDB,
  getLikeSearchFromDB,
  getSearchDataFromDB
} = require("../config/config_db");
const citizenController = require("../controllers/citizen_controller");
const { prefixesController } = require("../controllers/prefix_controller");

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
  const query = `SELECT ID_CARD, first_name, last_name FROM citizen WHERE first_name LIKE ${searchTerm}'%'`;
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

// Search by first-name & last-name
router.get("/qf/:firstname/:lastname", async (req, res) => {
  // ดึงค่าจาก URL params
  const firstname = req.params.firstname;
  const lastname = req.params.lastname;

  // สร้าง query สำหรับค้นหาข้อมูลในฐานข้อมูล
  const query = `SELECT ID_CARD, first_name, last_name FROM citizen WHERE first_name = ? AND last_name = ? LIMIT 1`;
  const values = [firstname, lastname];

  try {
    // เรียกใช้ฟังก์ชันที่เชื่อมต่อฐานข้อมูลเพื่อดึงข้อมูล
    const results = await getSearchDataFromDB(query, values);

    // ถ้าพบผลลัพธ์
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

// get citizen amount
router.get("/:amount/:page", citizenController.getCitizenAmountPageCTL);

router.get("/prefix", prefixesController);

router.get("/:id_card", citizenController.getCitizenIdCTL);

// -------------------------------------------- END --------------------------------------------

// -------------------------------------------- Post --------------------------------------------

// For adding a citizen
router.post("/", citizenController.addCitizenController);

// -------------------------------------------- END --------------------------------------------

module.exports = router;
