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

const { authenticateJWT } = require("../middlewares/authJWT");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

// roles
router.get("/user", authenticateJWT,authorizeRoles("R003"), getAllUsers);
router.get("/role/active/:id", authenticateJWT,authorizeRoles("R003"), getRoleActiveCTL);
router.get("/role/:id", authenticateJWT,authorizeRoles("R003"), getOneRoleCTL);
router.post("/role/create", authenticateJWT,authorizeRoles("R003"), createRoleCTL);
router.put("/user/personal/:id", authenticateJWT,authorizeRoles("R003"), updatePersonalUserCTL);
router.put("/role/del/:id", authenticateJWT,authorizeRoles("R003"), deleteRoleCTL);
router.put("/user/del/:id", authenticateJWT,authorizeRoles("R003"), delUserCTL);
router.put("/role/:id", authenticateJWT,authorizeRoles("R003"), updateRoleCTL);
// -------------------------------------------- END --------------------------------------------

module.exports = router;
