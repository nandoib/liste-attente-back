const express = require("express");
const isAuth = require("../middlewares/is-auth");
const isAuthAdmin = require("../middlewares/is-auth-admin");
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");
const patientController = require("../controllers/patientController");
const patient = require("../models/patient");
const router = express.Router();
const { check, body } = require("express-validator");

router.post(
  "/newPatient",
  body("email").custom((value) => {
    return patient.findOne({ email: value }).then((user) => {
      if (user) {
        return Promise.reject("Adresse mail déja utilisée");
      }
    });
  }),
  patientController.addNewPatient
);

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
