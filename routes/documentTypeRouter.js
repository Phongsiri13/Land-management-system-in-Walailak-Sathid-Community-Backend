// routes/authRouter.js
const express = require("express");
const {
    dcLandTypeController,
    getOneDcLandTypeController,
    createDcLandTypeController,
    deleteDcLandTypeController,
    updateDcLandTypeController
} = require("../controllers/documentTypeController");

const router = express.Router();

router.get("/", dcLandTypeController);
router.get("/:id", getOneDcLandTypeController);
router.post("/create", createDcLandTypeController);
router.put("/:id", updateDcLandTypeController);
router.delete("/:id", deleteDcLandTypeController);
// -------------------------------------------- END --------------------------------------------

module.exports = router;
