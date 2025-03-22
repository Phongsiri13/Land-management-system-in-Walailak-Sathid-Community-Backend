// routes/authRouter.js
const express = require("express");
const {
  getDataFromDB,
  insertDataToDB,
  getLikeSearchFromDB,
  getSearchDataFromDB
} = require("../config/config_db");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const citizenController = require("../controllers/citizen_controller");
const { prefixesController } = require("../controllers/prefix_controller");
const { authenticateJWT } = require("../middlewares/authJWT");
const {  authorizeRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

// -------------------------------------------- GET --------------------------------------------

// update citizen
router.put("/:id", authenticateJWT, authorizeRoles("R001"), citizenController.updateCitizenCTL);

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
router.get("/qf", citizenController.getCitizenByFullNameCTL);
// land holding
router.get("/holding/:id", authenticateJWT, authorizeRoles("R001", "R002"), citizenController.getOneCitizenLandHoldCTL);
router.get("/history_citizen/:id", authenticateJWT, authorizeRoles("R001", "R002"), citizenController.getOneHistoryCitizenCTL);
router.get("/fullname/:name", authenticateJWT, authorizeRoles("R001", "R002"), citizenController.getOneHistoryCitizenCTL);
// get citizen amount
router.get("/:amount/:page", authenticateJWT, authorizeRoles("R001", "R002"), citizenController.getCitizenAmountPageCTL);
router.get("/filter/:amount/:page", authenticateJWT, authorizeRoles("R001", "R002"), citizenController.getCitizenFilterAmountPageCTL); // ไม่ใช้แล้ว
router.get("/history_citizen/:amount/:page", authenticateJWT, authorizeRoles("R001", "R002"), citizenController.getCitizenHistoryAmountPageCTL);

router.get("/prefix", prefixesController);

router.get("/:id_card", authenticateJWT, authorizeRoles("R001", "R002"), citizenController.getCitizenIdCTL);

// For adding a citizen
router.post("/", authenticateJWT, authorizeRoles("R001"), citizenController.addCitizenController);

module.exports = router;
