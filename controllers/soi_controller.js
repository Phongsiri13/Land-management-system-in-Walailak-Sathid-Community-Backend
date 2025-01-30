// Model
const { soiModel } = require("../model/commonModel");

const soiController = async (req, res) => {
  console.log("---------------soi---------------");
  try {
    const results = await soiModel();
    res.json(results);
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

module.exports = {
  soiController,
};
