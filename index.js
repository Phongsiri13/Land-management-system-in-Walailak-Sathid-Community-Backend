const express = require("express");
const cors = require("cors");
const session = require("express-session");
const Memorystore = require("memorystore")(session); // ใช้ memorystore กับ express-session
const checkRole = require("./middlewares/checkRole");

// routers
const loginRouter = require("./routes/loginRouter");
const peopleRouter = require("./routes/citizenRouter");
const landRouter = require("./routes/landRouter");
const heirRouter = require("./routes/heirRouter");
const statusRouter = require("./routes/statusRouter");
const landUsageRouter = require("./routes/landUseRouter");
const documentLandTypeRouter = require("./routes/documentTypeRouter");
const relationRouter = require("./routes/relationRouter");
const uploadFileRouter = require("./routes/uploadFileRouter");
const dashboardRouter = require("./routes/dashboardRouter");

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173", // ที่อยู่ของ Vue.js client
    credentials: true, // อนุญาตให้ส่ง cookies
  })
);

const cookie_ex = 60000 * 60; // 60000 = 1 นาที ตั้งให้ cookie หมดอายุภายใน 1 นาที

// ตั้งค่า session โดยใช้ memorystore สำหรับเก็บข้อมูล session ใน memory
app.use(
  session({
    secret: "secretTheKey", // ค่าลับสำหรับการเข้ารหัส session ID
    store: new Memorystore({
      checkPeriod: 86400000, // ล้าง session ที่หมดอายุทุก 24 ชั่วโมง
    }), // ใช้ memorystore ในการเก็บข้อมูล session
    resave: false, // ไม่ต้องบันทึก session ใหม่ทุกครั้ง
    saveUninitialized: false, // ไม่สร้าง session ใหม่หากไม่มีการเปลี่ยนแปลงใดๆ
    cookie: {
      httpOnly: true, // ป้องกันการเข้าถึง cookie จาก JavaScript
      secure: false, // ตั้งเป็น true หากใช้ https
      // sameSite: 'none',
      maxAge: cookie_ex,
    },
  })
);

app.use(express.json());

// ให้บริการไฟล์จากโฟลเดอร์ 'uploads'
app.use("/uploads", express.static("uploads"));

// Data management
app.use("/login", loginRouter);
app.use("/land", landRouter);
app.use("/citizen", peopleRouter);
app.use("/heir", heirRouter);
app.use("/manage_status_info", statusRouter);
app.use("/manage_land_usages_info", landUsageRouter);
app.use("/manage_land_document_type", documentLandTypeRouter);
app.use("/manage_relation", relationRouter);
app.use("/upload_file", uploadFileRouter);
app.use("/dashboard", dashboardRouter);


function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next(); // ถ้ามีข้อมูล user ใน session
  } else {
    res.status(401).send("Unauthorized"); // ถ้าไม่มี session
  }
}

// get roles
app.get("/api/getUserRole", isAuthenticated, (req, res) => {
  console.log("#".repeat(50));
  console.log("s-id:", req.sessionID);
  const userId = req.sessionID; // ดึง userId จาก session
  console.log("userID:", userId);
  if (userId) {
    const userRole = 3; // ดึง role จากฐานข้อมูลจำลอง
    console.log("there is");
    res.json({ role: userRole, s_id: userId });
  } else {
    res.status(401).send("Unauthorized");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
