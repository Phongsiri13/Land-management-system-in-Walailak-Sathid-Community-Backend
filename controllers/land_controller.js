const landService = require("../services/LandService");
const landModel = require("../model/landModel");
const { getOneLandUse } = require("../model/commonModel");

// CTL = Controller
const addLandController = async (req, res) => {
  const landData = req.body;
  try {
    const newLand = await landService.addLand(landData);
    console.log("newland:", newLand);
    res.json(newLand);
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

const updateLandCTL = async (req, res) => {
  const id = req.params.id;
  const landData = req.body;
  console.log("id:", id);

  try {
    const newLand = await landService.UpdateLand(landData, id);
    if (!newLand) {
      return res.status(422);
    }
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
    if (!newLand) {
      return res.status(422);
    }
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
    const newLand = await landModel.landHistoryLandHistoryOneCompare(parseInt(landData.id));
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
  getLandHistoryOneCompareCTL
};
