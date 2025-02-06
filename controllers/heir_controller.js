const heirService = require("../services/HeirService");

const addHeirController = async (req, res) => {
  const HeirData = req.body;
  try {
    const heir = await heirService.addHeir(HeirData);
    res.status(200).json(heir);
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
    addHeirController,
};
