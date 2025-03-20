// Model
const {
  createRole,
  updateOneRole,
  deleteOneRole,
  getRoleActive,
  getOneRole,
} = require("../model/userModel");

// use
const getOneRoleCTL = async (req, res) => {
  const { id } = req.params;
  console.log("role_id:", id);

  console.log("--------------- Role get one ---------------");
  try {
    const values = [id];
    const results = await getOneRole(values);
    return res.json({
      data: results,
    });
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

// use
const getRoleActiveCTL = async (req, res) => {
  const { id } = req.params;
  console.log("getOne:", req.params);

  console.log("--------------- Actived Role ---------------");
  try {
    const values = [id];
    const results = await getRoleActive(values);
    return res.json({
      success: true,
      data: results,
    });
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

// use
const createRoleCTL = async (req, res) => {
  const { label } = req.body;
  console.log("--------------- Role create ---------------");
  try {
    const values = [label];
    console.log('values:', values)
    const results = await createRole(values);
    if (results) {
      return res.json({
        success: true,
        message: "เพิ่มข้อมูลสิทธิ์ผู้ใช้สำเร็จ!",
      });
    } else {
      throw {
        statusCode: 400,
        success: false,
        message: "ไม่สามารถเพิ่มข้อมูลสิทธิ์ผู้ใช้ได้!",
      };
    }
  } catch (err) {
    if (err.statusCode == 400) {
      return res.json(err);
    }
    res.status(500).send("ระบบขัดข้อง");
  }
};

// use
const updateRoleCTL = async (req, res) => {
  const { role_name } = req.body; // Access the sent data from the request body
  const id = req.params.id; // Get the ID from the URL

  if (!id) {
    return res.status(400).send({ message: "ID parameter is required" });
  }
  console.log("--------------- Role updateOne ---------------");
  try {
    const values = [role_name, id];
    console.log(values);
    const results = await updateOneRole(values);
    if (results == true) {
      return res.status(200).json({
        success: true,
        message: "อัพเดทสิทธิ์ผู้ใช้สำเร็จ!",
      });
    } else {
      throw {
        statusCode: 400,
        success: false,
        message: "อัพเดทสิทธิ์ผู้ใช้ไม่สำเร็จ!",
      };
    }
  } catch (err) {
    console.log(err);
    if (err.statusCode == 400) {
      return res.json(err);
    }
    res.status(500).send("ระบบขัดข้อง");
  }
};

// use
const deleteRoleCTL = async (req, res) => {
  const id = req.params.id; // Get the ID from the URL
  const active = req.body;
  // console.log(active)

  if (!id) {
    return res.status(400).send({ message: "ID parameter is required" });
  }
  console.log("--------------- Role remove ---------------");
  try {
    const values = [active.id, id];
    const results = await deleteOneRole(values);
    if (results == true) {
      return res.status(200).json({
        success: true,
        message: "ลบสิทธิ์ผู้ใช้สำเร็จ!",
      });
    } else {
      throw {
        statusCode: 400,
        success: false,
        message: "ลบสิทธิ์ผู้ใช้ไม่สำเร็จ!",
      };
    }
  } catch (err) {
    console.log(err);
    if (err.statusCode == 400) {
      return res.json(err);
    }
    res.status(500).send("ระบบขัดข้อง");
  }
};

module.exports = {
  getOneRoleCTL,
  createRoleCTL,
  updateRoleCTL,
  deleteRoleCTL,
  getRoleActiveCTL,
};
