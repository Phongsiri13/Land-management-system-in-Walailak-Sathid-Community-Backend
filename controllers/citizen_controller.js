const citizenService = require("../services/CitizenService");
const citizenModel = require("../model/citizenModel");

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

const updateCitizen = async (req, res) => {
  const citizenData = req.body;
  try {
    const newLand = await citizenService.addCitizen(citizenData);
    res.status(200).json(newLand);
  } catch (err) {
    console.error("Error inserting data: ", err);
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
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

const getCitizenAmountPageCTL = async (req, res) => {
  const {amount, page} = req.params;
  console.log('citizenAmount:', amount + ' : ', page);
  try {
    const isCitizen = await citizenService.getCitizenPage(amount,page);
    if (!isCitizen) {
      return res.status(422);
    }
    res.status(200).json(isCitizen);
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addCitizenController,
  updateCitizen,
  getCitizenIdCTL,
  getCitizenAmountPageCTL
};
