const express = require("express");
const isAuth = require("../middlewares/is-auth");
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");
const router = express.Router();

router.post("/adminlogin", authController.adminLogin);
router.get("/admin", adminController.getAllPatient);
router.post("/newAdmin", adminController.addAdmin);
module.exports = router;
