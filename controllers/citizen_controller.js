const citizenService = require("../services/CitizenService");

const addCitizenController = async (req, res) => {
  const citizenData = req.body;
  try {
    const newLand = await citizenService.addCitizen(citizenData);
    res.status(200).json(newLand);
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

module.exports = {
  addCitizenController,
  updateCitizen,
};
