const citizenModel = require("../model/citizenModel");
const citizen = require("../validation/citizenSchema");

function convertToDatabaseModel(getPeopleModel) {
  return {
    first_name: getPeopleModel.firstName, // firstName → first_name
    last_name: getPeopleModel.lastName, // lastName → last_name
    prefix_id: getPeopleModel.prefix, // prefix → prefix_id
    birthday: getPeopleModel.birthDate, // birthDate → birthday
    house_number: getPeopleModel.houseNumber, // houseNumber → house_number
    village_number: getPeopleModel.village, // village → village_number
    district: getPeopleModel.subdistrict, // subdistrict → district
    soi: getPeopleModel.selectedSoi, // selectedSoi → soi
    phone_number: getPeopleModel.phone, // phone → phone_number
    gender: getPeopleModel.gender, // gender → gender
    citizenId: getPeopleModel.citizenId,
  };
}

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
    console.log("err:", err);
    throw {
      statusCode: err.statusCode || 500, // ใช้ 500 หากไม่มี statusCode
      message: `${err.message}`,
      status: err.status,
      code: err.code,
    };
  }
};

// page and limit
const getCitizenPage = async (amount, page, filter) => {
  console.log("param:", amount, " : ", page);
  console.log("filter:", filter);
  try {
    const result = await citizenModel.citizenAmountPage(page, amount, filter);
    // console.log('re-sult:',result)
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    throw new Error(`Error adding citizen: ${error.message}`);
  }
};

const getCitizenFilterPage = async (amount, page, queryList, filter_type) => {
  console.log("param:", filter_type);
  try {
    const result = await citizenModel.citizenFilterAmountPage(
      queryList,
      page,
      amount,
      filter_type
    );
    // console.log('re-sult:',result)
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    throw new Error(`Error adding citizen: ${error.message}`);
  }
};

const getCitizenHistoryPage = async (amount, page, filter) => {
  try {
    const result = await citizenModel.citizenHistoryAmountPage(
      page,
      amount,
      filter
    );
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    throw new Error(`Error adding citizen: ${error.message}`);
  }
};

// updateCitizen
const updateCitizen = async (citizenData, idCard) => {
  const formPeopleData = citizenData;
  console.log("formData:", formPeopleData);

  try {
    if (!idCard) {
      throw new Error(`Validation Error: ไม่พบราษฎร`);
    }
    const afterData = convertToDatabaseModel(formPeopleData);

    const { error, value } = citizen.validate(afterData);
    if (error) {
      throw new Error(`Validation Error: ${error.details[0].message}`);
    }
    const values = [
      value.first_name,
      value.last_name,
      value.prefix_id,
      value.birthday || null,
      value.house_number,
      value.village_number,
      value.district,
      value.phone_number,
      value.soi,
      value.gender,
      value.citizenId,
    ];
    const result = await citizenModel.updateCitizenByOne(
      values,
      afterData.citizenId
    );
    return {
      success: true,
      message: "อัพเดทข้อมูลราษฎรสำเร็จแล้ว!",
      data: result,
    };
  } catch (err) {
    throw {
      statusCode: err.statusCode || 500, // ใช้ 500 หากไม่มี statusCode
      message: `${err.message}`,
      status: err.status,
      code: err.code,
    };
  }
};

module.exports = {
  addCitizen,
  getCitizenPage,
  updateCitizen,
  getCitizenHistoryPage,
  getCitizenFilterPage,
};
