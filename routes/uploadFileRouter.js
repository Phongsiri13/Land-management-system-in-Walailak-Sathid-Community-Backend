// routes/authRouter.js
const express = require("express");
const { pool, insertDataToDB } = require("../config/config_db");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises; // ใช้ promises version ของ fs
const landModel = require("../model/landModel");

const router = express.Router();
const liveStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join("uploads", "land_lives");
    fs.mkdir(dir, { recursive: true }) // สร้างโฟลเดอร์ถ้ายังไม่มี
      .then(() => cb(null, dir))
      .catch((err) => cb(err, null));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // ดึงนามสกุลไฟล์
    console.log(ext);
    const fileName = Date.now() + ext; // ใช้ timestamp + นามสกุลไฟล์
    cb(null, fileName); // ส่งกลับเฉพาะชื่อไฟล์ (ไม่รวม path)
  },
});

// ฟังก์ชันตรวจสอบประเภทไฟล์
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("รองรับเฉพาะไฟล์ประเภท JPG และ PNG"), false);
  }
};

// ตั้งค่า multer
const upload = multer({
  storage: liveStorage,
  fileFilter: fileFilter,
});

// Middleware สำหรับอัปโหลดไฟล์
const handleFileUpload = upload.single("file");

// Route handler สำหรับอัปโหลดไฟล์ + บันทึกฐานข้อมูล
const uploadAndInsertToDB = async (req, res) => {
  handleFileUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      console.log("📁 File received:", req.file);
      console.log("📝 Other data:", req.body.landID);
      const LAND_ID = req.body.landID;
      const fileName = req.file.filename;

      const query =
        "INSERT INTO document_lives (path_file,doc_land_id) VALUES (?,?);";
      const body = [fileName, LAND_ID];

      const success = await insertDataToDB(query, body);

      if (success) {
        return res
          .status(200)
          .json({ message: "ไฟล์ถูกอัปโหลดและบันทึกในฐานข้อมูลสำเร็จ" });
      } else {
        // 🔥 หากบันทึกฐานข้อมูลล้มเหลว → ลบไฟล์
        await fs.unlink(req.file.path);
        console.log(`❌ File ${req.file.path} deleted due to database error.`);
        return res
          .status(500)
          .json({ message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล ไฟล์ถูกลบ" });
      }
    } catch (err) {
      // 🔥 ลบไฟล์หากเกิดข้อผิดพลาด
      if (req.file) {
        await fs.unlink(req.file.path);
        console.log(`❌ File ${req.file.path} deleted due to server error.`);
      }

      return res.status(500).json({
        message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์ ไฟล์ถูกลบ",
        error: err.message,
      });
    }
  });
};

router.get("/live_files", async (req, res) => {
  console.log("query:", req.query.land_id);
  if (!req.query.land_id) {
    return res.send("query is wrong");
  }
  const LAND_ID = req.query.land_id;

  try {
    const landData = await landModel.getAllLiveFileByID(LAND_ID);
    // console.log("landData:", landData);

    return res.status(200).json(landData); // ส่งเฉพาะชื่อไฟล์กลับไป
  } catch (err) {
    console.error("❌ Error reading files:", err);
    return res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลไฟล์" });
  }
});

// กำหนด path ของโฟลเดอร์หลักของโปรเจค
const projectRoot = path.join(__dirname, ".."); // ย้อนกลับหนึ่งระดับจากโฟลเดอร์ routes

// router.get("/live_files/:filePath", async (req, res) => {
//   const filePath = req.params.filePath; // รับ filePath จาก URL
//   const fullPath = path.join(
//     __dirname,
//     "..",
//     "uploads",
//     "land_lives",
//     filePath
//   ); // สร้าง path ที่ถูกต้อง

//   console.log("Requested file:", filePath); // Log ชื่อไฟล์ที่ขอ
//   console.log("Full path:", fullPath); // Log path เต็ม

//   // ตรวจสอบว่าไฟล์มีอยู่จริงหรือไม่
//   if (fs.existsSync(fullPath)) {
//     // ส่งไฟล์กลับไปยัง client
//     res.sendFile(fullPath, (err) => {
//       if (err) {
//         console.error("Error sending file:", err);
//         res.status(500).send("Error fetching file");
//       }
//     });
//   } else {
//     // หากไฟล์ไม่มีอยู่ ส่งข้อความผิดพลาดกลับ
//     console.error("File not found:", fullPath);
//     res.status(404).send("File not found");
//   }
// });

router.get('/download_live/:filePath', async (req, res) => {
  const filePath = req.params.filePath; // รับชื่อไฟล์จาก URL
  console.log('filename:',filePath)
  const fullPath = path.join('uploads', 'land_lives', filePath);

  try {
    // ตรวจสอบว่าไฟล์มีอยู่จริง
    await fs.access(fullPath);

    // ส่งไฟล์กลับไปยัง client
    res.download(fullPath, filePath, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).send("Error downloading file");
      }
    });
  } catch (err) {
    // หากไฟล์ไม่มีอยู่ ส่งข้อความผิดพลาดกลับ
    res.status(404).send("File not found");
  }
});

router.post("/land/live", uploadAndInsertToDB);

module.exports = router;
