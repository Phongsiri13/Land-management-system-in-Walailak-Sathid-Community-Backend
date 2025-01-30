// Model
const {prefixModel} = require("../model/commonModel");

const prefixesController = async (req, res) => {
  console.log("---------------prefix---------------");
  try {
    const results = await prefixModel()
    res.json(results);
  } catch (err) {
    // console.error("Error executing query: " + err.message);
    res.status(500).send("Database query error");
  }
};

module.exports = {
  prefixesController,
};
