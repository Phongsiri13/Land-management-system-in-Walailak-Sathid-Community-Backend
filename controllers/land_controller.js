const landService = require("../services/LandService");
const landModel = require("../model/landModel");

// CTL = Controller

const addLandController = async (req, res) => {
  const landData = req.body;
  try {
    const newLand = await landService.addLand(landData);
    if (!newLand) {
      return res.status(422);
    }
    res.status(200).json(newLand);
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

const getLandAmountPageCTL = async (req, res) => {
  const landData = req.params;
  console.log('land-data:', landData)
  try {
    const newLand = await landService.getLandPage();
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
  console.log('land-data-id:', landData)
  try {
    const newLand = await landModel.getlandById(landData);
    if (!newLand) {
      return res.status(422);
    }
    res.status(200).json(newLand);
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  addLandController,
  getLandAmountPageCTL,
  getLandIdCTL
};
