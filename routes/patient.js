const express = require("express");
const isAuth = require("../middlewares/is-auth");
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");
const patientController = require("../controllers/patientController");
const router = express.Router();

router.post("/newPatient", patientController.addNewPatient);

router.delete(
  "/deletePatient/:patientId",
  isAuth,
  patientController.deletePatient
);

router.post("/validerMail", isAuth, patientController.validateMail);

router.post("/deleteMe", isAuth, patientController.deletePatient);

router.put("/editPatient/:patientId", isAuth, patientController.patientEdit);

router.post("/patient/login", isAuth, authController.patientlogin);

module.exports = router;
