// Model
const { landStatusModel } = require("../model/commonModel");

const landStatusController = async (req, res) => {
  console.log("--------------- LandStatus ---------------");
  try {
    const results = await landStatusModel();
    res.json(results);
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

module.exports = {
  landStatusController,
};
