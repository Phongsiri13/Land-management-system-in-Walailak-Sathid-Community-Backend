const landModel = require("../model/landModel");

// Mange adding Land
const addLand = async (landData) => {
  const formLand = landData;
  try {
    const values = [
      formLand.tf_number,
      formLand.spk_area,
      formLand.number,
      formLand.volume,
      formLand.address,
      formLand.soi,
      parseFloat(formLand.rai) || null,
      parseFloat(formLand.ngan) || null,
      parseFloat(formLand.square_wa) || null,
      formLand.district,
      formLand.village,
      // parseFloat(formLand.long) || null,
      // parseFloat(formLand.lat) || null,
      formLand.notation,
      formLand.land_status,
      formLand.id_card,
    ];
    // Logic before sending to db

    const result = await landModel.addLand(values);
    if (result) {
      // console.log("insert-people successfully");
      return result;
    } else {
      return result;
    }
  } catch (err) {
    throw new Error(`Error adding citizen: ${err.message}`);
  }
};

module.exports = {
  addLand,
};
