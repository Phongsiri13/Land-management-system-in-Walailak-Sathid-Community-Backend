const citizenService = require("../services/CitizenService");
const citizenModel = require("../model/citizenModel");
const { message } = require("../validation/citizenSchema");

const addCitizenController = async (req, res) => {
  const citizenData = req.body;
  try {
    const newCitizen = await citizenService.addCitizen(citizenData);
    res.status(200).json(newCitizen);
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

const updateCitizenCTL = async (req, res) => {
  const ID = req.params.id;
  const citizenData = req.body.dataUpdate;

  try {
    const newCitizen = await citizenService.updateCitizen(citizenData, ID);
    res.status(200).json(newCitizen);
  } catch (err) {
    console.error("Error update data: ", err);
    res.status(500).json({ message: err.message });
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
  console.log("citizenAmount:", amount + " : ", page);
  try {
    const isCitizen = await citizenService.getCitizenPage(amount, page);
    if (!isCitizen) {
      return res.status(422);
    }
    res.status(200).json(isCitizen);
  } catch (err) {
    console.error("Error search data: ", err);
    res.status(500).json({ message: err.message });
  }
};

const getCitizenByFullNameCTL = async (req, res) => {
  const {firstname, lastname} = req.query;

  if (!firstname || !lastname) {
    return res
      .status(400)
      .json({ message: "ข้อมูลที่ใช้คนหาไม่ถูกต้อง", status:false });
  }

  try {
    const values = [firstname, lastname];
    const results = await citizenModel.getFullnameCitizen(values);
    if (results) {
      return res.status(200).json({
        message: "มีราษฎรคนนี้ในระบบ",
        status: true,
        data: results
      });
    }
    return res.status(200).json({ message: "ไม่พบราษฎรในระบบ", status:false  });
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
};
