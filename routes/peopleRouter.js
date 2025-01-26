// routes/authRouter.js
const express = require("express");
// const { testConnection } = require("../config/config_db");
const {
  getDataFromDB,
  insertDataToDB,
  getLikeSearchFromDB,
} = require("../config/config_db");
const router = express.Router();

function convertToThaiDateFormat(dateString) {
  // แปลงวันที่เป็นวัตถุ Date
  const date = new Date(dateString);

  // ดึงค่าวัน เดือน และปี
  const day = String(date.getDate()).padStart(2, "0"); // เติม 0 ข้างหน้า ถ้าเลขหลักเดียว
  const month = String(date.getMonth() + 1).padStart(2, "0"); // เดือนเริ่มที่ 0 จึงต้อง +1
  const thaiYear = date.getFullYear() + 543; // แปลงปีเป็น พ.ศ.

  // คืนค่ารูปแบบ วัน/เดือน/ปี
  return `${thaiYear}-${month}-${day}`;
}

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

router.get("/prefix", async (req, res) => {
  console.log("---------------prefix---------------");
  try {
    const query = "SELECT * FROM prefix";
    const results = await getDataFromDB(query);
    res.json(results);
  } catch (err) {
    console.error("Error executing query: " + err.message);
    return res.status(500).send("Database query error");
  }
});

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

router.post("/", async (req, res) => {
  const formPeopleData = req.body; // Access the data sent from the client
  console.log(formPeopleData); // Log the form data for debugging
  const query = `INSERT INTO people (
        ID_CARD, first_name, last_name, prefix_id, birthday, house_number, village_number, district, soi, phone_number, gender
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  // db field names
  const values = [
    formPeopleData.citizenId,
    formPeopleData.firstName,
    formPeopleData.lastName,
    formPeopleData.prefix,
    convertToThaiDateFormat(formPeopleData.birthDate) || null,
    formPeopleData.houseNumber,
    formPeopleData.village,
    formPeopleData.subdistrict,
    formPeopleData.selectedSoi,
    formPeopleData.phone,
    formPeopleData.gender,
  ];

  // console.log("thai-date:",convertToThaiDateFormat(formPeopleData.birthDate))
  // return	res.status(200).send("Data saved successfully");

  try {
    const results = await insertDataToDB(query, values);
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

// -------------------------------------------- END --------------------------------------------

module.exports = router;
