// routes/authRouter.js
const express = require("express");
const { pool, insertDataToDB } = require("../config/config_db");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises; // ใช้ promises version ของ fs
const landModel = require("../model/landModel");
const citizenModel = require("../model/citizenModel");
const { removeDataToDB } = require("../config/config_db");

const router = express.Router();

// All files are uploads folder

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

const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join("uploads", "documents");
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

const documentCitizenStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join("uploads", "citizen_documents");
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
const fileLiveFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("รองรับเฉพาะไฟล์ประเภท JPG และ PNG"), false);
  }
};

const fileDocumentFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf", // PDF
    "application/vnd.ms-excel", // .xls (Excel 97-2003)
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "text/csv", // CSV
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("รองรับเฉพาะไฟล์ประเภท PDF, Excel (.xls, .xlsx) และ CSV"),
      false
    );
  }
};

const fileCitizenDocumentFilter = (req, file, cb) => {
  const allowedType = "application/pdf"; // อนุญาตเฉพาะ PDF

  // ตรวจสอบประเภทไฟล์
  if (file.mimetype !== allowedType) {
    return cb(new Error("รองรับเฉพาะไฟล์ PDF เท่านั้น"), false);
  }

  // ตรวจสอบขนาดไฟล์ (ไม่เกิน 5MB)
  if (file.size > 5 * 1024 * 1024) {
    // 5MB = 5 * 1024 * 1024 bytes
    return cb(new Error("ขนาดไฟล์ต้องไม่เกิน 5MB"), false);
  }

  cb(null, true);
};

// ตั้งค่า multer
const liveUpload = multer({
  storage: liveStorage,
  fileFilter: fileLiveFilter,
});

const documentUpload = multer({
  storage: documentStorage,
  fileFilter: fileDocumentFilter,
});

const citizenDocumentUpload = multer({
  storage: documentCitizenStorage,
  fileFilter: fileCitizenDocumentFilter,
});

// Middleware สำหรับอัปโหลดไฟล์
const handleLiveFileUpload = liveUpload.single("file");
const handleDocumentFileUpload = documentUpload.single("file");
const handleCitizenDocumentFileUpload = citizenDocumentUpload.single("file");

// Route handler สำหรับอัปโหลดไฟล์ + บันทึกฐานข้อมูล
const uploadLive = async (req, res) => {
  handleLiveFileUpload(req, res, async (err) => {
    // return res.status(400).json({ message: "dsds"});
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      console.log("📁 File received:", req.file);
      console.log("📝 Other data:", req.body);
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

const uploadLandDocument = async (req, res) => {
  handleDocumentFileUpload(req, res, async (err) => {
    // return res.status(400).json({ message: "dsds"});
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      console.log("📁 File received:", req.file);
      console.log("📝 Other data:", req.body.landID);
      const LAND_ID = req.body.landID;
      const fileName = req.file.filename;

      const query =
        "INSERT INTO document_lands (l_path_file,land_id) VALUES (?,?);";
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

const uploadCitizenDocument = async (req, res) => {
  handleCitizenDocumentFileUpload(req, res, async (err) => {
    // return res.status(400).json({ message: "dsds"});
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      console.log("📁 File received:", req.file);
      console.log("📝 Other data:", req.body.landID);
      const CITIZEN_ID = req.body.landID;
      const fileName = req.file.filename;
      console.log("citizen_id:", CITIZEN_ID);

      const query =
        "INSERT INTO document_citizen (path_file,CARD_ID) VALUES (?,?);";
      const body = [fileName, CITIZEN_ID];

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

// ลบภาพที่อยู่อาศัย
const uploadLiveDelete = async (req, res) => {
  const fileId = req.params.id;
  console.log('file-id:',fileId)

  try {
    // 1️⃣ **ดึงข้อมูลไฟล์จากฐานข้อมูล**
    const rows = await pool.query(
      "SELECT path_file FROM document_lives WHERE id_live_doc = ?;",
      [fileId]
    );
    console.log(rows)

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบไฟล์ในฐานข้อมูล" });
    }

    const filePath = `./uploads/land_lives/${rows[0].path_file}`; // เปลี่ยนเป็น path จริงของเซิร์ฟเวอร์คุณ

    // 2️⃣ **ลบข้อมูลออกจากฐานข้อมูล**
    const deleteQuery = "DELETE FROM document_lives WHERE id_live_doc = ?";
    await pool.query(deleteQuery, [fileId]);

    // 3️⃣ **ลบไฟล์ออกจาก file-server**
    await fs.unlink(filePath);
    console.log(`✅ ลบไฟล์สำเร็จ: ${filePath}`);

    return res
      .status(200)
      .json({ message: "ลบไฟล์และข้อมูลในฐานข้อมูลสำเร็จ" });
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาด:", err.message);
    return res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการลบไฟล์", error: err.message });
  }
};

// ลบ citizen document
const uploadCitizenDelete = async (req, res) => {
  const fileId = req.params.id;
  console.log('file-id:',fileId)

  try {
    // 1️⃣ **ดึงข้อมูลไฟล์จากฐานข้อมูล**
    const rows = await pool.query(
      "SELECT path_file FROM document_citizen WHERE dc_id = ?;",
      [fileId]
    );
    console.log(rows)

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบไฟล์ในฐานข้อมูล" });
    }

    const filePath = `./uploads/citizen_documents/${rows[0].path_file}`; // เปลี่ยนเป็น path จริงของเซิร์ฟเวอร์คุณ

    // 2️⃣ **ลบข้อมูลออกจากฐานข้อมูล**
    const deleteQuery = "DELETE FROM document_citizen WHERE dc_id = ?";
    await pool.query(deleteQuery, [fileId]);

    // 3️⃣ **ลบไฟล์ออกจาก file-server**
    await fs.unlink(filePath);
    console.log(`✅ ลบไฟล์สำเร็จ: ${filePath}`);

    return res
      .status(200)
      .json({ message: "ลบไฟล์และข้อมูลในฐานข้อมูลสำเร็จ" });
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาด:", err.message);
    return res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการลบไฟล์", error: err.message });
  }
};

// ลบ เอกสารที่ดิน
const uploadLandDocumentDelete = async (req, res) => {
  const fileId = req.params.id;
  console.log('file-id:',fileId)

  try {
    // 1️⃣ **ดึงข้อมูลไฟล์จากฐานข้อมูล**
    const rows = await pool.query(
      "SELECT l_path_file FROM document_lands WHERE id_doc = ?;",
      [fileId]
    );
    console.log(rows)

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบไฟล์ในฐานข้อมูล" });
    }

    const filePath = `./uploads/documents/${rows[0].l_path_file}`; // เปลี่ยนเป็น path จริงของเซิร์ฟเวอร์คุณ

    // 2️⃣ **ลบข้อมูลออกจากฐานข้อมูล**
    const deleteQuery = "DELETE FROM document_lands WHERE id_doc = ?";
    await pool.query(deleteQuery, [fileId]);

    // 3️⃣ **ลบไฟล์ออกจาก file-server**
    await fs.unlink(filePath);
    console.log(`✅ ลบไฟล์สำเร็จ: ${filePath}`);

    return res
      .status(200)
      .json({ message: "ลบไฟล์และข้อมูลในฐานข้อมูลสำเร็จ" });
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาด:", err.message);
    return res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการลบไฟล์", error: err.message });
  }
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

router.get("/document_files", async (req, res) => {
  console.log("query:", req.query.land_id);
  if (!req.query.land_id) {
    return res.send("query is wrong");
  }
  const LAND_ID = req.query.land_id;

  try {
    const landData = await landModel.getAllDocumentFileByID(LAND_ID);
    // console.log("landData:", landData);

    return res.status(200).json(landData); // ส่งเฉพาะชื่อไฟล์กลับไป
  } catch (err) {
    console.error("❌ Error reading files:", err);
    return res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลไฟล์" });
  }
});

router.get("/citizen/document_files", async (req, res) => {
  console.log("query:", req.query.citizen_id);
  if (!req.query.citizen_id) {
    return res.send("query is wrong");
  }
  const CITIZEN_ID = req.query.citizen_id;

  try {
    const landData = await citizenModel.getAllFileByID(CITIZEN_ID);
    // console.log("landData:", landData);

    return res.status(200).json(landData); // ส่งเฉพาะชื่อไฟล์กลับไป
  } catch (err) {
    console.error("❌ Error reading files:", err);
    return res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลไฟล์" });
  }
});

// ดาวโหลดภาพที่อยู่อาศัย
router.get("/download_live/:filePath", async (req, res) => {
  const filePath = req.params.filePath; // รับชื่อไฟล์จาก URL
  console.log("filename:", filePath);
  const fullPath = path.join("uploads", "land_lives", filePath);

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

// ดาวโหลดเอกสารราษฎร
router.get("/download_document/:filePath", async (req, res) => {
  const filePath = req.params.filePath; // รับชื่อไฟล์จาก URL
  console.log("filename:", filePath);
  const fullPath = path.join("uploads", "citizen_documents", filePath);

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

// ดาวโหลดเอกสาร
router.get("/download_land_document/:filePath", async (req, res) => {
  const filePath = req.params.filePath; // รับชื่อไฟล์จาก URL
  console.log("filename:", filePath);
  const fullPath = path.join("uploads", "documents", filePath);

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

router.get("/citizen/document_files/:filePath", async (req, res) => {
  const filePath = req.params.filePath; // รับชื่อไฟล์จาก URL
  console.log("filename:", filePath);
  const fullPath = path.join("uploads", "documents", filePath);

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

router.get("/citizen_documents/:filePath", async (req, res) => {
  const filePath = req.params.filePath; // รับชื่อไฟล์จาก URL
  console.log("filename:", filePath);
  const fullPath = path.join("uploads", "citizen_documents", filePath);

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

router.post("/land/live", uploadLive);
router.post("/land/documents", uploadLandDocument);
router.post("/citizen/documents", uploadCitizenDocument);

router.delete("/land/live/:id", uploadLiveDelete);
router.delete("/land/document/:id", uploadLandDocumentDelete);
router.delete("/citizen/:id", uploadCitizenDelete);

module.exports = router;
