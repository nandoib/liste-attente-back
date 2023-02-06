const Patient = require("../models/patient");
const Admin = require("../models/admin");
const bcrypt = require("bcrypt");

exports.getAllPatient = async (req, res, next) => {
  try {
    const patients = await Patient.find();

    res.status(200).json({
      message: "patients trouvés",
      patients: patients,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    res.status(err.statusCode).json({ message: err.message });
  }
};

exports.addAdmin = async (req, res, next) => {
  const prenom = req.body.prenom;
  const email = req.body.email;
  const password = req.body.password;
  const nom = req.body.nom;

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const admin = new Admin({
      prenom: prenom,
      nom: nom,
      email: email,
      password: hashedPassword,
    });
    await admin.save();

    res.status(201).json({ message: "Admin enregistré", admin: admin });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    res.status(err.statusCode).json({ message: err.message });
  }
};
