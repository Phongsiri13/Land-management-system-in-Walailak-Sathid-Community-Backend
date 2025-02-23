const heirService = require("../services/HeirService");
const heirModel = require("../model/heirModel");

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

const updateHeirAllCTL = async (req, res) => {
  const HeirData = req.body;
  const HEIR_ID = req.params.id;
  console.log("heir:", HeirData);

  try {
    const heir = await heirService.updateHeir(HeirData, HEIR_ID);
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
  const { fname, lname } = req.query;
  console.log("fname:", fname, ", lname:", lname);

  try {
    const HeirData = { first_name: fname, last_name: lname };
    const heir = await heirService.getFullNameHeir(HeirData);
    res.json(heir);
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

const getAllHeirCTL = async (req, res) => {
  const { heirData } = req.body;
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
  console.log(heirData);

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

const getAllHeirWithRelationCTL = async (req, res) => {
  const heirData = req.params.id;
  console.log(heirData);

  try {
    const heir = await heirModel.getWithRelationByHeir(parseInt(heirData));
    console.log(heir);
    // Process the input to combine duplicates
    const result = heir.reduce((acc, current) => {
      const existingHeir = acc.find((heir) => heir.heir_id === current.heir_id);

      if (existingHeir) {
        existingHeir.relationships.push({
          relationship_id: current.relationship_id,
          label: current.label,
          citizen_id: current.citizen_id,
          citizen_first_name: current.citizen_first_name,
          citizen_last_name: current.citizen_last_name,
        });
      } else {
        acc.push({
          heir_id: current.heir_id,
          created_at: current.created_at,
          heir_first_name: current.heir_first_name,
          heir_last_name: current.heir_last_name,
          prefix_id: current.prefix_id,
          prefix_name: current.prefix_name,
          relationships: [
            {
              relationship_id: current.relationship_id,
              label: current.label,
              citizen_id: current.citizen_id,
              citizen_first_name: current.citizen_first_name,
              citizen_last_name: current.citizen_last_name,
            },
          ],
        });
      }
      return acc;
    }, []);
    console.log('result:',result)
    res.status(200).json(result);
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

const getAllHeirWithRelationToCitizenCTL = async (req, res) => {
  const heirData = req.params.id;
  console.log(heirData);

  try {
    const heir = await heirModel.getWithRelationByCitizen(parseInt(heirData));
    console.log(heir);
    
    res.status(200).json(heir);
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

const getHeirAmountPageCTL = async (req, res) => {
  const { amount, page } = req.params;
  console.log("dsadsa");
  if (amount != 50) {
    return res.send("you got error");
  }
  console.log("citizenAmount:", amount + " : ", page);
  try {
    const isCitizen = await heirService.getHeirPage(amount, page);
    if (!isCitizen) {
      return res.status(422);
    }
    res.status(200).json(isCitizen);
  } catch (err) {
    console.error("Error search data: ", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addHeirController,
  getHeirFullNameCTL,
  getAllHeirCTL,
  addHeirAllController,
  getOneHeirCTL,
  updateHeirAllCTL,
  getHeirAmountPageCTL,
  getAllHeirWithRelationCTL,
  getAllHeirWithRelationToCitizenCTL
};
