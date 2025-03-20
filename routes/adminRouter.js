// routes/authRouter.js
const express = require("express");
const { 
    getRoleActiveCTL, getOneRoleCTL, updateRoleCTL,
    deleteRoleCTL, createRoleCTL
} = require("../controllers/roles_controller");

const { 
    getAllUsers,
    updatePersonalUserCTL,
    delUserCTL
} = require("../controllers/userAccount_controller");

const { pool } = require("../config/config_db");

const router = express.Router();

// roles
router.get("/user", getAllUsers);
router.get("/role/active/:id", getRoleActiveCTL);
router.get("/role/:id", getOneRoleCTL);
router.post("/role/create", createRoleCTL);
router.put("/user/personal/:id", updatePersonalUserCTL);
router.put("/role/del/:id", deleteRoleCTL);
router.put("/user/del/:id", delUserCTL);
router.put("/role/:id", updateRoleCTL);
// -------------------------------------------- END --------------------------------------------

module.exports = router;
