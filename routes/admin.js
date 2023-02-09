const express = require("express");
const isAuth = require("../middlewares/is-auth");
const isAuthAdmin = require("../middlewares/is-auth-admin");
const authController = require("../controllers/authController");
const patientController = require("../controllers/patientController");
const adminController = require("../controllers/adminController");
const router = express.Router();

router.post("/adminlogin", authController.adminLogin);
router.get("/allPatients", isAuthAdmin, adminController.getAllPatient);
router.post("/newAdmin", adminController.addAdmin);
router.post(
  "/validatePatient/:patientId",
  isAuthAdmin,
  patientController.patientStatutEdit
);
router.put(
  "/editPatient/:patientId",
  isAuthAdmin,
  patientController.patientEdit
);
router.delete(
  "/deletePatient/:patientId",
  isAuthAdmin,
  patientController.deletePatient
);

router.post(
  "/addRendezVous/:patientId",
  isAuthAdmin,
  adminController.addRendezvous
);

module.exports = router;
