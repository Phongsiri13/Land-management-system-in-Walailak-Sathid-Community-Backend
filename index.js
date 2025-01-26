const express = require("express");
// const db_config = require("./config/config_db");
const cors = require("cors");
const session = require("express-session");
const Memorystore = require("memorystore")(session); // ใช้ memorystore กับ express-session
const checkRole = require("./middlewares/checkRole");

// routers
const loginRouter = require("./routes/loginRouter");
const peopleRouter = require("./routes/peopleRouter");
const landRouter = require("./routes/landRouter");
const heirRouter = require("./routes/heirRouter");

const app = express();
const port = 3000;

// old session
// app.use(
//   session({
//     secret: "xaxa123",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }, // ใช้ true หากใช้ https
//   })
// );

// app.use(
//   cors({
//     origin: "*", // ที่อยู่ของ Vue.js client
//     credentials: true, // อนุญาตให้ส่ง cookies
//   })
// ); 

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

// app.use(cors());
app.use(express.json());

// console.log(req.connection.remoteAddress); // หรือ req.ip
app.get("/detect", (req, res) => {
  const userAgent = req.headers["user-agent"];
  const language = req.headers["accept-language"];
  const connectionType = req.headers["connection"];
  const cookies = req.headers['cookie'];
  
  console.log("-".repeat(100));
  
  console.log(cookies || 'no cookies');
  console.log(language);
  console.log(userAgent);
  console.log(connectionType);

  console.log("-".repeat(100));

  res.send("Detecting user");
});

// ให้บริการไฟล์จากโฟลเดอร์ 'uploads'
app.use("/uploads", checkRole, express.static("uploads"));

app.use("/login", loginRouter);
app.use("/land", landRouter);
app.use("/people", peopleRouter);
app.use("/heir", heirRouter)

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
