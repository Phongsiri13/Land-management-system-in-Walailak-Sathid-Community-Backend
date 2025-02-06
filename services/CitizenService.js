const citizenModel = require("../model/citizenModel");

// Mange adding Citizen
const addCitizen = async (citizenData) => {
  const formPeopleData = citizenData;
  try {
    const values = [
      formPeopleData.citizenId,
      formPeopleData.firstName,
      formPeopleData.lastName,
      formPeopleData.prefix,
      formPeopleData.birthDate || null,
      formPeopleData.houseNumber,
      formPeopleData.village,
      formPeopleData.subdistrict,
      formPeopleData.selectedSoi,
      formPeopleData.phone,
      formPeopleData.gender,
    ];
    
    const result = await citizenModel.addCitizen(values);
    return result;
  } catch (err) {
    throw new Error(`Error adding citizen: ${err.message}`);
  }
};

// page and limit
const getCitizenPage = async (amount,page) => {
  console.log('param:',amount, ' : ', page)
  try {
    const result = await citizenModel.citizenAmountPage(page,amount);
    console.log('re-sult:',result)
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    throw new Error(`Error adding citizen: ${err.message}`);
  }
}

module.exports = {
  addCitizen,
  getCitizenPage
};
