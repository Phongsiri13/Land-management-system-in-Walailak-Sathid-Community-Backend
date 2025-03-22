// routes/authRouter.js
const express = require("express");
// const mysql = require("mysql2");
const {
  getSearchDataFromDB,
} = require("../config/config_db");
const router = express.Router();
const {
  addLandController,
  getLandAmountPageCTL,
  deleteLandByActiveCTL,
  getLandHistoryAmountPageCTL,
  getLandIdCTL,
  updateLandCTL,
  getLandHistoryOneCompareCTL,
  getLandUseByIdCTL_V2,
  updateAndAddLandUseCTL,
  getLandActiveCTL
} = require("../controllers/land_controller");
const {
  landStatusController,
} = require("../controllers/landStatus_controller");
const { soiController } = require("../controllers/soi_controller");
const AUTH_ROLE = require('../middlewares/authName')
const { authenticateJWT } = require("../middlewares/authJWT");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

function convertNganAndSquareWaToRai(ngan, squareWa) {
  const totalSquareWa = ngan * 100 + squareWa; // แปลงงานและตารางวาเป็นตารางวาทั้งหมด
  const rai = totalSquareWa / 400; // แปลงตารางวาเป็นไร่ (1 ไร่ = 400 ตารางวา)
  return rai; // ส่งค่าที่แปลงเสร็จออกมา
}

function concealmentFormat(phoneNumber, word_count = 6) {
  const regex = new RegExp(`^(\\d{${word_count}})(\\d{4})$`);
  return phoneNumber.replace(regex, `xxxxxx$2`);
}

// 
router.get("/complete_land/:id", authenticateJWT, (req, res) => {
  // Get the id from the URL parameter
  const landId = req.params.id;
  const land_and_people_data = [];

  connection.query(
    `
    SELECT *
FROM land l
JOIN land_status ls ON l.current_land_status = ls.ID_land_status
WHERE l.id_land = ?;
    `,
    [landId], // Pass the dynamic id as an array of parameters
    (err, results) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return res.status(500).send("Database query error");
      }
      console.log(results[0]);
      if (results.length > 0) {
        console.log(results[0]);
        if (results[0].id_card) {
          connection.query(
            `
        SELECT *
  FROM citizen p
  JOIN prefix pf ON p.prefix_id = pf.prefix_id
  WHERE p.ID_CARD = ?;
        `,
            [results[0].id_card], // Pass the dynamic id as an array of parameters
            (err, results2) => {
              if (err) {
                console.error("Error executing query: " + err.stack);
                return res.status(500).send("Database query error");
              }
              if (results2.length > 0) {
                connection.query(
                  `
              SELECT he.first_name, he.last_name, pf.prefix_name, he.heir_id
  FROM heir he
  JOIN prefix pf ON he.prefix_id = pf.prefix_id
  WHERE he.id_card = ?;
              `,
                  [results[0].id_card], // Pass the dynamic id as an array of parameters
                  (err, heir_result) => {
                    if (err) {
                      console.error("Error executing query: " + err.stack);
                      return res.status(500).send("Database query error");
                    }
                    // console.log(heir_result)
                    land_and_people_data.push({
                      landInformation: results,
                      peopleInformation: results2,
                      heirInformation: heir_result,
                    });
                    // ส่งข้อมูลที่พบกลับไป
                    return res.json(land_and_people_data);
                  }
                );
              } else {
                // ถ้าไม่พบข้อมูล
                return res
                  .status(404)
                  .send("No data found for the given ID card");
              }
            }
          );
        } else {
          land_and_people_data.push({
            landInformation: results,
            peopleInformation: [],
            heirInformation: [],
          });
          return res.json(land_and_people_data);
        }
        // ส่งข้อมูลที่พบกลับไป
        // res.json(results);
      } else {
        // ถ้าไม่พบข้อมูล
        res.status(404).send("No data found for the given Land ID");
      }
    }
  );
});

// Search route for user
router.get("/search", async (req, res) => {
  const query = req.query.q; // รับค่า query 'q' ที่ส่งมาใน URL
  if (!query) {
    return res.status(400).json({ message: 'Query parameter "q" is required' });
  }

  const query_land = `SELECT tf_number, id_card, number, spk_area, volume, 
  l_district, rai, ngan, square_wa FROM land WHERE tf_number = ? LIMIT 1`;
  const values = [query];

  try {
    const results = await getSearchDataFromDB(query_land, values);
    if (results.length > 0) {
      if (results[0].ngan && results[0].square_wa) {
        const cal_to_rai = convertNganAndSquareWaToRai(
          results[0].ngan,
          results[0].square_wa
        );
        results[0]["total_rai"] = cal_to_rai;
      }
      results[0].spk_area = concealmentFormat(results[0].spk_area, 5);
      console.log("result:", results);
      console.log("result-id:", results[0].id_card);
      if (results) {
        const query_people = `SELECT phone_number FROM citizen WHERE ID_CARD = ?`;
        const values_p = [results[0].id_card];
        const result = await getSearchDataFromDB(query_people, values_p);
        results[0].phone_number =
          concealmentFormat(result[0].phone_number) || null;
      }
      return res.json({ results });
    }
    res.json({ results: [] });
  } catch (err) {
    console.error("Error executing query: " + err.message);
    return res.status(500).send("Database query error");
  }
});
router.get("/sois", soiController);
router.get("/land_status", landStatusController);
router.get("/:id", authenticateJWT, authorizeRoles("R001", "R002"), getLandIdCTL);
// Get One
router.get("/active/:id", authenticateJWT,authorizeRoles("R001", "R002"), getLandActiveCTL);
router.get("/v2/land_use/:id", authenticateJWT,authorizeRoles("R001", "R002"), getLandUseByIdCTL_V2);
router.get("/history_land/:id", authenticateJWT,authorizeRoles("R001", "R002"), getLandHistoryOneCompareCTL);
router.get("/history_land/:amount/:page", authenticateJWT,authorizeRoles("R001", "R002"), getLandHistoryAmountPageCTL);

router.get("/complete_land/:amount/:page", authenticateJWT,authorizeRoles("R001", "R002"), getLandAmountPageCTL);

router.post("/", authenticateJWT,authorizeRoles("R001"), addLandController);
router.put("/v2/update_land_use/:landId", authenticateJWT,authorizeRoles("R001"), updateAndAddLandUseCTL);
// Update the land is selected
router.put("/:id", authenticateJWT,authorizeRoles("R001"), updateLandCTL);
router.delete("/active/:id", authenticateJWT,authorizeRoles("R001"), deleteLandByActiveCTL);

module.exports = router;
