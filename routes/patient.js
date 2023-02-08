const express = require("express");
const isAuth = require("../middlewares/is-auth");
const isAuthAdmin = require("../middlewares/is-auth-admin");
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");
const patientController = require("../controllers/patientController");
const patient = require("../models/patient");
const router = express.Router();

router.post("/newPatient", patientController.addNewPatient);

router.delete(
  "/deletePatient/:patientId",
  isAuth,
  patientController.deletePatient
);

router.post("/validerMail", isAuth, patientController.validateMail);

router.put("/editPatient/:patientId", isAuth, patientController.patientEdit);

router.post("/patient/login", authController.patientlogin);
router.get("/getPatient/:patientId", isAuth, patientController.getPatient);

module.exports = router;
