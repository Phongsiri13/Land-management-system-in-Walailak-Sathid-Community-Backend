// Model
const { relationModel } = require("../model/commonModel");

const relationController = async (req, res) => {
  console.log("---------------relation---------------");
  try {
    const results = await relationModel();
    res.json(results);
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

module.exports = {
  relationController,
};
