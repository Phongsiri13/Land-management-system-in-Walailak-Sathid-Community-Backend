const heirModel = require("../model/heirModel");

// Mange adding Heir
const addHeir = async (citizenData) => {
  const heirData = citizenData;
  try {
    const values = [heirData.fname_heir, heirData.lname_heir, heirData.prefix];
    const result = await heirModel.addHeir(values);
    return result;
  } catch (err) {
    throw new Error(`Error adding citizen: ${err.message}`);
  }
};

module.exports = {
  addHeir,
};
