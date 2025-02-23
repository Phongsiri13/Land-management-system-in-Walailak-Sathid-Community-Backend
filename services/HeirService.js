const heirModel = require("../model/heirModel");
const { heirSchema, heirFullnameSchema } = require("../validation/heirSchema");

// Mange adding Heir
const addHeir = async (data) => {
  const heirData = data;
  try {
    const { error, value } = heirSchema.validate(heirData);
    if (error) {
      throw new Error(`Validation Error: ${error.details[0].message}`);
    }

    const values = [value.first_name, value.last_name, value.prefix_id];
    const result = await heirModel.addHeir(values);
    return result;
  } catch (err) {
    throw new Error(`Error adding the heir: ${err.message}`);
  }
};

const updateHeir = async (data, id) => {
  const heirData = data;
  console.log('id:',id)
  try {
    const { error, value } = heirSchema.validate(heirData);
    if (error) {
      throw new Error(`Validation Error: ${error.details[0].message}`);
    }

    const values = [value.first_name, value.last_name, value.prefix_id, parseInt(id)];
    const result = await heirModel.updateHeir(values);
    return result;
  } catch (err) {
    throw new Error(`Error updating heir: ${err.message}`);
  }
};

const addRelationalToHeirsAll = async (data) => {
  const heirData = data;
  console.log(heirData);
  try {
    const result = await heirModel.addHeirAll(heirData);

    if (result.affectedRows > 0) {
      return {
        status: true,
        message: `Successfully added ${result.affectedRows} heir(s).`,
        data: result,
      };
    } else {
      return {
        status: false,
        message: "No heirs were added.",
        data: result,
      };
    }
  } catch (err) {
    return {
      status: "error",
      message: `Error adding Relation citizen and heirs: ${err.message}`,
    };
  }
};

const getFullNameHeir = async (data) => {
  const heirData = data;
  try {
    const { error, value } = heirFullnameSchema.validate(heirData);
    if (error) {
      throw new Error(`Validation Error: ${error.details[0].message}`);
    }

    const values = [value.first_name, value.last_name];
    const result = await heirModel.getFullnameHeir(values);
    return result;
  } catch (err) {
    throw new Error(`Error adding citizen: ${err.message}`);
  }
};

// page and limit
const getHeirPage = async (amount,page) => {
  console.log('param:',amount, ' : ', page)
  try {
    const result = await heirModel.heirAmountPage(page,amount);
    console.log('re-sult:',result)
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    throw new Error(`Error adding citizen: ${error.message}`);
  }
}

module.exports = {
  addHeir,
  getFullNameHeir,
  addRelationalToHeirsAll,
  updateHeir,
  getHeirPage
};
