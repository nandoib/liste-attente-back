const Patient = require("../models/patient");
var generator = require("generate-password");
const nodeMailer = require("nodemailer");

exports.patientStatutEdit = async (req, res, next) => {
  const patientId = req.params.patientId;

  try {
    const patientStatut = req.body.patientStatut;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      const error = new Error("Impossible de trouver le patient");
      error.statusCode(422);
      throw error;
    }

    patient.statut = patientStatut;

    const result = await patient.save();
    res.status(200).json({ message: "patient mis a jour", patient: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deletePatient = async (req, res, next) => {
  const patientId = req.params.patientId;
  try {
    const patient = await Patient.findById(patientId);

    await Patient.findByIdAndRemove(patientId);

    res.status(200).json({ message: "Patient supprimé", patient: patient });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(err.statusCode).json({ message: err.message });
  }
};

exports.addNewPatient = async (req, res, next) => {
  const prenom = req.body.prenom;
  const nom = req.body.nom;
  const email = req.body.email;
  const tel = req.body.tel;
  const dateNaissance = req.body.dateNaissance;
  const motifPriseEnCharge = req.body.motifPriseEnCharge;
  const adresse = req.body.adresse;
  const codePostal = req.body.codePostal;
  const ville = req.body.ville;

  const patientPassword = generator.generate({
    length: 5,
    numbers: true,
  });

  try {
    const patient = new Patient({
      prenom: prenom,
      nom: nom,
      email: email,
      tel: tel,
      dateNaissance: dateNaissance,
      motifPriseEnCharge: motifPriseEnCharge,
      adresse: adresse,
      codePostal: codePostal,
      ville: ville,
      password: patientPassword,
      statut: "valide",
    });

    await patient.save();

    const transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "nandoibba@gmail.com",
        pass: process.env.GMAIL,
      },
    });

    const mailMessage = {
      from: "nandoibba@gmail.com ",
      to: patient.email,
      subject: "Inscription Liste attente ortophoniste",
      text:
        "Bonjour, votre inscription est validée. Votre code d'accés est " +
        patient.password +
        " ",
    };
    transporter.sendMail(mailMessage, function (error, data) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + data.response);
      }
    });

    res.status(201).json({ message: "Patient enregistré", patient: patient });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    res.status(err.statusCode).json({ message: err.message });
  }
};

exports.patientEdit = async (req, res, next) => {
  const patientId = req.params.patientId;

  //Validation
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("validation failed");
      error.statusCode = 422;
      throw error;
    }

    const patientPrenom = req.body.patientPrenom;
    const patientNom = req.body.patientNom;
    const patientEmail = req.body.patientEmail;
    const patientTel = req.body.patientTel;
    const patientDateNaissance = req.body.patientDateNaissance;
    const patientMotifPriseEnCharge = req.body.patientMotifPriseEnCharge;
    const patientAdresse = req.body.patientAdresse;
    const patientCodePostal = req.body.patientCodePostal;
    const patientVille = req.body.patientVille;
    const patientStatut = req.body.patientStatut;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      const error = new Error("Impossible de trouver le patient");
      error.statusCode(422);
      throw error;
    }

    patient.prenom = patientPrenom;
    patient.nom = patientNom;
    patient.email = patientEmail;
    patient.tel = patientTel;
    patient.dateNaissance = patientDateNaissance;
    patient.motifPriseEnCharge = patientMotifPriseEnCharge;
    patient.adresse = patientAdresse;
    patient.codePostal = patientCodePostal;
    patient.ville = patientVille;
    patient.statut = patientStatut;

    const result = await patient.save();
    res.status(200).json({ message: "patient mis a jour", patient: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.validateMail = async (req, res, next) => {
  const patientId = req.params.patientId;

  try {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      const error = new Error("Impossible de trouver le patient");
      error.statusCode(422);
      throw error;
    }

    patient.statut = "valide";

    const result = await patient.save();
    res.status(200).json({ message: "patient mis à jour", patient: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
