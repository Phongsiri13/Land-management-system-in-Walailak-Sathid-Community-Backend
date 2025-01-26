// routes/authRouter.js
const express = require("express");
// const mysql = require("mysql2");
const {getDataFromDB, insertDataToDB, getSearchDataFromDB} = require('../config/config_db')
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
// const checkRole = require("../middlewares/checkRole");

// Configure multer for file uploads
// ตั้งค่า storage ของ multer
const liveStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join("uploads", "lives");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // ระบุว่าไฟล์จะถูกเก็บที่ไหน
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ใช้เวลาปัจจุบันเป็นชื่อไฟล์
  },
});

const file_limit = 3;
const uploadLives = multer({
  storage: liveStorage,
  limits: { files: file_limit },
});

router.post("/", async (req, res) => {
  console.log('land-post')
  const formLand = req.body;
  console.log('land:',formLand); // Log the form data for debugging
  const query = `
    INSERT INTO land (
      tf_number, spk_area, number, volume, l_house_number, current_soi, 
      rai, ngan, square_wa, l_district, l_village_number, notation, 
      current_land_status, id_card
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  // db field names
  const landValues = [
    formLand.tf_number,
    formLand.spk_area,
    formLand.number,
    formLand.volume,
    formLand.address,
    formLand.soi,
    parseFloat(formLand.rai) || null,
    parseFloat(formLand.ngan) || null,
    formLand.square_wa,
    formLand.district,
    formLand.village,
    // parseFloat(formLand.long) || null,
    // parseFloat(formLand.lat) || null,
    formLand.notation,
    formLand.land_status,
    formLand.id_card,
  ];

  console.log('land-x:',landValues, "count:",landValues.length);

  try {
    const results = await insertDataToDB(query, landValues);
    console.log("insert-result:", results);
    if (results) {
      // console.log("insert-people successfully");
      return res
        .status(200)
        .send({ message: "ข้อมูลของคุณได้ถูกบันทึกเรียบร้อยแล้ว" });
    }
    // ถ้า results ไม่เป็น true
    console.error("Database error: Data insertion failed");
    return res.status(422).send({ message: "เพิ่มข้อมูลไม่สำเร็จ" });
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).send("Error saving data");
  }
});

router.get("/complete_land/:id", (req, res) => {
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
        if(results[0].id_card){
          connection.query(
            `
        SELECT *
  FROM people p
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
                return res.status(404).send("No data found for the given ID card");
              }
            }
          );
        }
        else{
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

router.get("/complete_land", (req, res) => {
  connection.query(
    `
SELECT 
    prefix_name, 
    first_name, 
    last_name, 
    p.ID_CARD AS "ID", 
    land_status_name, 
    l.id_land, 
    current_soi, 
    l.number, 
    p.phone_number,
    l.tf_number,
    l.spk_area
FROM land l
LEFT JOIN people p ON l.id_card = p.ID_CARD
LEFT JOIN prefix pr ON p.prefix_id = pr.prefix_id
LEFT JOIN land_status ls ON l.current_land_status = ls.ID_land_status
ORDER BY l.created_at DESC;
`,
    (err, results) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return res.status(500).send("Database query error");
      }
      if (results.length > 0) {
        // ส่งข้อมูลที่พบกลับไป
        res.json(results);
      } else {
        // ถ้าไม่พบข้อมูล
        res.status(404).send("No data found for the given ID card");
      }
    }
  );
});

// Search route
router.get('/search', async (req, res) => {
  const query = req.query.q; // รับค่า query 'q' ที่ส่งมาใน URL
  if (!query) {
    return res.status(400).json({ message: 'Query parameter "q" is required' });
  }

  const query_land = `SELECT * FROM land WHERE tf_number = ? LIMIT 1`;
  const values = [query]
  
  try {
    const results = await getSearchDataFromDB(query_land, values);
    res.json(results);
  } catch (err) {
    console.error("Error executing query: " + err.message);
    return res.status(500).send("Database query error");
    // res.status(404).send("No data found for the given ID card");
  }
});

router.get("/sois", async (req, res) => {

  const query = "SELECT id_alley FROM alley";
  
  try {
    const results = await getDataFromDB(query);
    res.json(results);
  } catch (err) {
    console.error("Error executing query: " + err.message);
    return res.status(500).send("Database query error");
    // res.status(404).send("No data found for the given ID card");
  }
});

router.get("/land_status", async (req, res) => {
  const query = "SELECT * FROM land_status ORDER BY ID_land_status";
  try {
    const results = await getDataFromDB(query);
    res.json(results);
  } catch (err) {
    console.error("Error executing query: " + err.message);
    return res.status(500).send("Database query error");
  }
});

// upload lives image
router.post(
  "/upload_live",
  uploadLives.array("resume", file_limit),
  (req, res) => {
    const data = req.body;
    if (!req.files) {
      return res.status(400).send("No files uploaded.");
    }
    console.log("uploadLive:", data);
    // หากอัพโหลดไฟล์สำเร็จ
    res.send({
      message: "Files uploaded successfully!",
      files: req.files,
    });
  }
);

// GET endpoint to fetch all images
router.get("/upload_lives", (req, res) => {
  console.log("dirname:");
  const directoryPath = path.join("uploads", "lives");

  // Check if the 'uploads/files' directory exists
  if (!fs.existsSync(directoryPath)) {
    return res.status(404).json({ message: "Directory not found" });
  }

  // Read all files in the directory
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Error reading directory" });
    }

    // Filter out only image files (e.g., jpg, png, gif)
    const imageFiles = files.filter((file) =>
      [".jpg", ".jpeg", ".png", ".gif", "PNG"].includes(
        path.extname(file).toLowerCase()
      )
    );

    // If there are no images in the directory
    if (imageFiles.length === 0) {
      return res.status(404).json({ message: "No images found" });
    }

    // Construct the full URL using the domain (host) and protocol (http/https)
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Send the list of image file names
    res.json({
      message: "Images retrieved successfully!",
      images: imageFiles.map((file) => ({
        filename: file,
        url: `${baseUrl}/uploads/lives/${file}`, // Construct the URL for each image
      })),
    });
  });
});
module.exports = router;
