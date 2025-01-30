const landService = require("../services/LandService");

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

module.exports = {
  addLandController,
};
