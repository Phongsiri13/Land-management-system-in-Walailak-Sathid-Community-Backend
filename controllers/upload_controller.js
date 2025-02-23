const { getDataAllWithOneFromDB } = require("../config/config_db");

const uploadLiveFileCTL = async (req, res) => {
  const data = req.body;
  if (!req.files) {
    return res.status(400).send("No files uploaded.");
  }
  console.log("uploadLive:", data);
  // หากอัพโหลดไฟล์สำเร็จ
  res.send({
    message: "Files uploaded successfully!",
    files: req.files,
  });
};

module.exports = {
  uploadLiveFileCTL,
};
