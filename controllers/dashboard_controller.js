// Model
const { getDashboardModel, getOneDashboardModel, 
  getDashboardCitizenTableModel, getDashboardTableModel } = require("../model/commonModel");

const dashboardCTL = async (req, res) => {  
  try {
    const results = await getDashboardModel();
    res.json(results);
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

const dashboardOneCTL = async (req, res) => {
  console.log('req-param-dash:', req.params)
  console.log('req-param-dash:', typeof req.params.id)
  // have to detect a value
  try {
    const results = await getOneDashboardModel(parseInt(req.params.id));
    res.json(results);
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
    dashboardCitizenTableCTL
};
