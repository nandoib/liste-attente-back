const express = require("express");
const isAuth = require("../middlewares/is-auth");
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");
const patientController = require("../controllers/patientController");
const router = express.Router();

router.post("/newPatient", isAuth, authController.addNewPatient);

router.delete(
  "/deletePatient/:patientId",
  isAuth,
  adminController.deletePatient
);

router.post("/validerMail", isAuth, patientController.validateMail);

router.post("/deleteMe", isAuth, patientController.deletePatient);

router.put("/editPatient/:patientId", isAuth, patientController.patientEdit);

router.post("/patient/login", authController.patientlogin);

module.exports = router;
