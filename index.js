require('dotenv').config();
const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require("cors");

// routers
const loginRouter = require("./routes/loginRouter");
const registerRouter = require("./routes/registerRouter");
const peopleRouter = require("./routes/citizenRouter");
const landRouter = require("./routes/landRouter");
const heirRouter = require("./routes/heirRouter");
const statusRouter = require("./routes/statusRouter");
const landUsageRouter = require("./routes/landUseRouter");
const documentLandTypeRouter = require("./routes/documentTypeRouter");
const relationRouter = require("./routes/relationRouter");
const uploadFileRouter = require("./routes/uploadFileRouter");
const dashboardRouter = require("./routes/dashboardRouter");

// create API gateway
const app = express();
const PORT = process.env.PORT || 3000;

// Cors
app.use(
  cors({
    origin: "http://localhost:5173", // ที่อยู่ของ Vue.js client
    credentials: true, // อนุญาตให้ส่ง cookies
  })
);

app.use(cookieParser()); // ใช้ cookie-parser เพื่อดึง cookies จาก request
app.use(express.json());

// ให้บริการไฟล์จากโฟลเดอร์ 'uploads'
app.use("/uploads", express.static("uploads"));

// Data management
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/land", landRouter);
app.use("/citizen", peopleRouter);
app.use("/heir", heirRouter);
app.use("/manage_status_info", statusRouter);
app.use("/manage_land_usages_info", landUsageRouter);
app.use("/manage_land_document_type", documentLandTypeRouter);
app.use("/manage_relation", relationRouter);
app.use("/upload_file", uploadFileRouter);
app.use("/dashboard", dashboardRouter);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
