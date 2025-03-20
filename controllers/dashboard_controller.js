// Model
const {
  getDashboardModel,
  getOneDashboardModel,
  getDashboardCitizenTableModel,
  getDashboardTableModel,
} = require("../model/commonModel");

const dashboardCTL = async (req, res) => {
  try {
    const results = await getDashboardModel();
    // console.log("results:", results);
    if (results.length > 0) {
      // แปลงค่า count จาก BigInt เป็น number
      const formattedResults = results.map((row) => ({
        usage_id: row.usage_id,
        count: Number(row.count), // แปลง BigInt เป็น number
      }));

      return res.status(200).json(formattedResults);
    }
    return res.status(200).json([]);
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

const dashboardOneCTL = async (req, res) => {
  console.log("req-param-dash:", req.params);
  // have to detect a value
  try {
    const results = await getOneDashboardModel(parseInt(req.params.id));
    if (results.length > 0) {
      // แปลงค่า count จาก BigInt เป็น number
      const formattedResults = results.map((row) => ({
        usage_id: row.usage_id,
        count: Number(row.count), // แปลง BigInt เป็น number
      }));

      return res.status(200).json(formattedResults);
    }
    res.json([]);
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

const dashboardTableCTL = async (req, res) => {
  try {
    const results = await getDashboardTableModel();
    res.json(results);
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

const dashboardCitizenTableCTL = async (req, res) => {
  try {
    const results = await getDashboardCitizenTableModel();
    res.json(results);
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

module.exports = {
  dashboardCTL,
  dashboardOneCTL,
  dashboardTableCTL,
  dashboardCitizenTableCTL,
};
