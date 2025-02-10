const heirService = require("../services/HeirService");
const heirModel = require("../model/heirModel")

const addHeirController = async (req, res) => {
  const HeirData = req.body;
  console.log("heir:", HeirData);

  try {
    const heir = await heirService.addHeir(HeirData);
    if (!heir) {
      return res.status(400).json({
        message: "เพิ่มข้อมูลไม่สำเร็จ",
        status: false,
      });
    }
    res.status(200).json({
      message: "เพิ่มข้อมูลสำเร็จ!",
      status: heir,
    });
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

const addHeirAllController = async (req, res) => {
  const HeirData = req.body;
  console.log("heir:", HeirData);
  try {
    const heir = await heirService.addRelationalToHeirsAll(HeirData);
    if (!heir) {
      return res.status(400).json({
        message: "เพิ่มข้อมูลไม่สำเร็จ",
        status: false,
      });
    }
    res.status(200).json({
      message: "เพิ่มข้อมูลสำเร็จ!",
      status: heir,
    });
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

const getHeirFullNameCTL = async (req, res) => {
  console.log('dsadsa')
  const { fname, lname } = req.query;
  console.log("fname:", fname, ", lname:", lname);

  try {
    const HeirData = { first_name: fname, last_name: lname };
    const heir = await heirService.getFullNameHeir(HeirData);
    if (!heir) {
      return res.status(400).json({
        message: "ไม่พบการค้นหา",
        status: false,
      });
    }
    res.status(200).json({
      message: "พบการค้นหา!",
      status: heir,
    });
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

const getAllHeirCTL = async (req, res) => {
  const { heirData} = req.body;
  // console.log("heirData:", heirData);

  try { 
    const heir = await heirModel.getSearchFullHeirs(heirData);
    if (!heir) {
      return res.status(400).json(heir);
    }
    res.status(200).json(heir);
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

const getOneHeirCTL = async (req, res) => {
  const heirData = req.params.id;
  console.log(heirData)

  try { 
    const heir = await heirModel.getHeirById(heirData);
    if (!heir) {
      return res.status(400).json(heir);
    }
    res.status(200).json(heir);
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addHeirController,
  getHeirFullNameCTL,
  getAllHeirCTL,
  addHeirAllController,
  getOneHeirCTL
};
