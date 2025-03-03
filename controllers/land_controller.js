const landService = require("../services/LandService");
const landModel = require("../model/landModel");
const { getOneLandUse, getOneLandUseModelV2 } = require("../model/commonModel");
const { insertDataToDB, removeDataToDB, pool } = require("../config/config_db");

// CTL = Controller
const addLandController = async (req, res) => {
  const landData = req.body;
  try {
    const newLand = await landService.addLand(landData);
    console.log("newland:", newLand);
    res.status(200).json({ message: "เพิ่มข้อมูลที่ดินสำเร็จ"}); // ใช้ 201 Created
  } catch (err) {
    console.error("Error inserting data: ",);

    // กรณีข้อมูลไม่ถูกต้อง (Validation Error)
    if (err.statusCode === 400) {
      return res.status(400).json({
        message: "ข้อมูลไม่ถูกต้อง",
        details: err.errors || err.message,
      });
    }

    // กรณีข้อมูลซ้ำ (Duplicate Key Error ของ MongoDB หรือฐานข้อมูลอื่น)
    if (err.statusCode === 409) {
      return res.status(409).json({
        message: "ข้อมูลซ้ำ เลขที่ดิน, แปลงเลขที่, หรือระวางนี้มีอยู่แล้วในระบบ",
      });
    }

    // จัดการข้อผิดพลาดของฐานข้อมูล (เช่น SQL หรือ MongoDB)
    // if (err.name === "SequelizeUniqueConstraintError") {
    //   return res.status(409).json({
    //     message: "ข้อมูลซ้ำ ไม่สามารถเพิ่มเลขที่ดินที่มีอยู่แล้ว",
    //   });
    // }

    // กรณีข้อผิดพลาดทั่วไป (Internal Server Error)
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};

const updateLandCTL = async (req, res) => {
  const id = req.params.id;
  const landData = req.body;
  console.log("id:", id);

  try {
    // throw new Error("ข้อความที่คุณต้องการให้แสดงเป็นข้อผิดพลาด");
    const newLand = await landService.UpdateLand(landData, id);
    res.status(200).json(newLand);
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

const deleteLandByActiveCTL = async (req, res) => {
  const id = req.params.id;
  const active = req.body;
  console.log("id:", id);
  console.log("active:", active);
  if (!active.active) {
    console.log("return err");
  }
  try {
    const values = [active.active, id];
    const result = await landModel.changeActiveLand(values, id);
    console.log("result:", result);
    if (!result) {
      return res.status(422);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

const getLandAmountPageCTL = async (req, res) => {
  const landData = req.params;
  const landQueryData = req.query;
  console.log("land-data:", landData);
  console.log("land-data-query:", req.query);
  try {
    const newLand = await landService.getLandPage(landQueryData, landData);
    res.status(200).json(newLand);
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

const getLandHistoryAmountPageCTL = async (req, res) => {
  const landData = req.params;
  console.log("land-data:", landData);
  try {
    const newLand = await landService.getLandHistoryPage(landData);
    if (!newLand) {
      return res.status(422);
    }
    res.status(200).json(newLand);
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

const getLandHistoryOneCompareCTL = async (req, res) => {
  const landData = req.params;
  console.log("land-data:", landData);
  try {
    const newLand = await landModel.landHistoryLandHistoryOneCompare(
      parseInt(landData.id)
    );
    if (!newLand) {
      return res.status(422);
    }
    res.status(200).json(newLand);
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

const getLandIdCTL = async (req, res) => {
  const landData = req.params.id;
  console.log("land-data-id:", landData);
  // return res.json({"xaxa":'dsadsa'});
  try {
    const newLand = await landModel.getlandById(landData);
    res.json(newLand);
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

const getLandActiveCTL = async (req, res) => {
  const landData = req.params.id;
  console.log("land-data-id:", landData);
  try {
    const newLand = await landModel.getLandActive(landData);
    res.json(newLand);
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

// ---------------------------------------- Land Use ----------------------------------------
const getLandUseByIdCTL = async (req, res) => {
  const landData = req.params.id;
  console.log("land-data-id:", landData);
  try {
    const newLand = await getOneLandUse(landData);
    res.json(newLand);
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

const getLandUseByIdCTL_V2 = async (req, res) => {
  const landData = req.params.id;
  console.log("land-data-id:", landData);
  // return res.send("hihihi");
  try {
    const landThatUse = await getOneLandUseModelV2(landData);
    res.json({ landThatUse });
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

// ไม่ใช้แล้ว
const updateLandUseCTL = async (req, res) => {
  const id = req.params.id;
  const landData = req.body;
  if (!landData.data) {
    return res.status(200).send("no");
  }
  // console.log("id:", id);
  // console.log("landData:", landData);
  try {
    const newLand = await landService.UpdateLandUse(landData, id);
    if (!newLand) {
      return res.status(422);
    }
    res.status(200).json(newLand);
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

// v2 for land_usage delete
const updateAndAddLandUseCTL = async (req, res) => {
  const { landId } = req.params;
  const landUsages = req.body;

  console.log("land-id:", landId);
  console.log("landUsages:", landUsages);

  // Input validation
  if (!Array.isArray(landUsages)) {
    return res.status(400).json({ error: "landUsages must be an array." });
  }
  for (const usage of landUsages) {
    if (!usage.land_ID || !usage.usage_id) {
      return res.status(400).json({
        error: "Each usage object must contain land_ID and usage_id.",
      });
    }
  }

  let connection;
  try {
    // Start Transaction
    connection = await pool.getConnection(); // function to get DB connection
    await connection.beginTransaction();

    // Delete existing data
    await connection.query("DELETE FROM land_land_usage WHERE land_ID = ?", [
      landId,
    ]);

    // Add new data or update existing data
    for (const usage of landUsages) {
      await connection.query(
        `INSERT INTO land_land_usage (land_ID, usage_id, details)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE details = VALUES(details)`,
        [usage.land_ID, usage.usage_id, usage.details]
      );
    }

    // Commit Transaction
    await connection.commit();
    res.json({ message: "Land usage updated successfully." });
  } catch (err) {
    // Rollback Transaction in case of error
    // if (connection) await connection.rollback();
    console.error("Error updating land usage data:", err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Duplicate entry detected." });
    }
    res.status(500).json({ error: err.message });
  } finally {
    // Release connection
    if (connection) connection.release();
  }
};

// ---------------------------------------- End Land Use ----------------------------------------

module.exports = {
  addLandController,
  getLandAmountPageCTL,
  getLandIdCTL,
  updateLandCTL,
  getLandUseByIdCTL,
  getLandActiveCTL,
  deleteLandByActiveCTL,
  updateLandUseCTL,
  getLandHistoryAmountPageCTL,
  getLandHistoryOneCompareCTL,
  getLandUseByIdCTL_V2,
  updateAndAddLandUseCTL,
};
