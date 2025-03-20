const citizenService = require("../services/CitizenService");
const citizenModel = require("../model/citizenModel");
// const { message } = require("../validation/citizenSchema");

const addCitizenController = async (req, res) => {
  const citizenData = req.body;
  try {
    const newCitizen = await citizenService.addCitizen(citizenData);
    res.status(200).json({ message: "เพิ่มข้อมูลสำเร็จ!", newCitizen });
  } catch (err) {
    console.error("Error inserting data: ", err);
    if (err.code === "ER_SIGNAL_EXCEPTION") {
      return res.status(409).json({
        statusCode: err.statusCode,
        message: "มีราษฎรคนนี้ในระบบแล้ว",
        status: err.status,
      });
    }
    // throw {
    //   statusCode: err.statusCode || 500, // ใช้ 500 หากไม่มี statusCode
    //   message: `${err.message}`,
    //   status: err.status
    // };
    // กรณีข้อมูลไม่ถูกต้อง (Validation Error)
    if (err.statusCode === 400) {
      return res.status(400).json({
        statusCode: err.statusCode,
        message: err.message,
        status: err.status,
      });
    }

    // กรณีข้อมูลซ้ำ (Duplicate Key Error ของ MongoDB หรือฐานข้อมูลอื่น)
    if (err.statusCode === 409) {
      return res.status(409).json({
        statusCode: err.statusCode,
        status: err.status,
        message: "มีบัตรประชาชนเลขนี้อยู่แล้วในระบบ",
      });
    }

    // กรณีข้อผิดพลาดทั่วไป (Internal Server Error)
    res.status(500).json({
      statusCode: err.statusCode,
      status: err.status,
      message: err.message,
    });
  }
};

const updateCitizenCTL = async (req, res) => {
  const ID = req.params.id;
  const citizenData = req.body.dataUpdate;
  console.log('citizenData:',citizenData)

  try {
    const newCitizen = await citizenService.updateCitizen(citizenData, ID);
    res.status(200).json(newCitizen);
  } catch (err) {
    console.error("Error inserting data: ", err);
    if (err.code === "ER_SIGNAL_EXCEPTION") {
      return res.status(409).json({
        statusCode: err.statusCode,
        message: "มีราษฎรคนนี้ในระบบแล้ว",
        status: err.status,
      });
    }
    // กรณีข้อมูลไม่ถูกต้อง (Validation Error)
    if (err.statusCode === 400) {
      return res.status(400).json({
        statusCode: err.statusCode,
        message: err.message,
        status: err.status,
      });
    }

    // กรณีข้อมูลซ้ำ (Duplicate Key Error ของ MongoDB หรือฐานข้อมูลอื่น)
    if (err.statusCode === 409) {
      return res.status(409).json({
        statusCode: err.statusCode,
        status: err.status,
        message: "มีบัตรประชาชนเลขนี้อยู่แล้วในระบบ",
      });
    }

    // กรณีข้อผิดพลาดทั่วไป (Internal Server Error)
    res.status(500).json({
      statusCode: err.statusCode,
      status: err.status,
      message: err.message,
    });
  }
};

const getCitizenIdCTL = async (req, res) => {
  const ID_CARD = req.params.id_card;
  console.log("citizen-id:", ID_CARD);
  try {
    const isCitizen = await citizenModel.getCitizenById(ID_CARD);
    if (!isCitizen) {
      return res.status(422);
    }
    res.status(200).json(isCitizen);
  } catch (err) {
    console.error("Error get data: ", err);
    res.status(500).json({ message: err.message });
  }
};

const getCitizenAmountPageCTL = async (req, res) => {
  const { amount, page } = req.params;
  // const { searchType, searchQuery, soi, district } = req.query;
  // console.log('req.query:', req.query)

  console.log("citizenAmount:", amount + " : ", page);
  try {
    const isCitizen = await citizenService.getCitizenPage(
      amount,
      page,
      req.query
    );
    res.status(200).json(isCitizen);
  } catch (err) {
    console.error("Error search data: ", err);
    res.status(500).json({ message: err.message });
  }
};

// ไม่ใช้แล้ว
const getCitizenFilterAmountPageCTL = async (req, res) => {
  const { amount, page } = req.params;
  console.log("citizenAmount:", amount + " : ", page);
  console.log("all-query:", req.query);
  // flname
  const queryList = ["สมรัก", req.query.soi, req.query.gender];
  try {
    const isCitizen = await citizenService.getCitizenFilterPage(
      amount,
      page,
      queryList[0],
      req.query
    );
    if (!isCitizen) {
      return res.status(422);
    }
    res.status(200).json(isCitizen);
  } catch (err) {
    console.error("Error search data: ", err);
    res.status(500).json({ message: err.message });
  }
};

const getCitizenHistoryAmountPageCTL = async (req, res) => {
  const { amount, page } = req.params;
  // const { searchType, searchQuery } = req.query;
  // console.log('req.query:', req.query)
  try {
    const isCitizen = await citizenService.getCitizenHistoryPage(
      amount,
      page,
      req.query
    );
    res.status(200).json(isCitizen);
  } catch (err) {
    console.error("Error search data: ", err);
    res.status(500).json({ message: err.message });
  }
};

const getCitizenByFullNameCTL = async (req, res) => {
  const { firstname, lastname } = req.query;

  if (!firstname || !lastname) {
    return res
      .status(400)
      .json({ message: "ข้อมูลที่ใช้คนหาไม่ถูกต้อง", status: false });
  }

  try {
    const values = [firstname, lastname];
    const results = await citizenModel.getFullnameCitizen(values);
    if (results) {
      return res.status(200).json({
        message: "มีราษฎรคนนี้ในระบบ",
        status: true,
        data: results,
      });
    }
    return res.status(200).json({ message: "ไม่พบราษฎรในระบบ", status: false });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Internal server error.");
  }
};

const getOneCitizenLandHoldCTL = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ message: "ข้อมูลที่ใช้คนหาไม่ถูกต้อง", status: false });
  }

  try {
    const values = [id];
    console.log("values:", values);
    const results = await citizenModel.getCitizenLandHold(values);
    console.log("rr:", results);
    return res.status(200).json(results);
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Internal server error.");
  }
};

const getOneHistoryCitizenCTL = async (req, res) => {
  const { id } = req.params;
  console.log("id:", id);

  if (!id) {
    return res
      .status(400)
      .json({ message: "ข้อมูลที่ใช้คนหาไม่ถูกต้อง", status: false });
  }

  try {
    const values = [id];
    console.log("values:", values);
    const results = await citizenModel.getOneCitizenHistory(values);

    return res.status(200).json(results);
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Internal server error.");
  }
};

module.exports = {
  addCitizenController,
  updateCitizenCTL,
  getCitizenIdCTL,
  getCitizenAmountPageCTL,
  getCitizenByFullNameCTL,
  getCitizenHistoryAmountPageCTL,
  getOneCitizenLandHoldCTL,
  getCitizenFilterAmountPageCTL,
  getOneHistoryCitizenCTL,
};
