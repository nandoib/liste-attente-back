const Patient = require("../models/patient");
var generator = require("generate-password");
const nodeMailer = require("nodemailer");
const { body, validationResult } = require("express-validator");
const cron = require("node-cron");

exports.patientStatutEdit = async (req, res, next) => {
  const patientId = req.params.patientId;

  try {
    const patientStatut = req.body.statut;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      const error = new Error("Impossible de trouver le patient");
      error.statusCode(422);
      throw error;
    }

    patient.statut = patientStatut;

    const result = await patient.save();

    if (patientStatut == "PEC") {
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
        subject: "Votre prise en charge orthophonie ",
        text: "Bonjour, bonne nouvelle, votre prise en charge est validée. Merci de remplir ce formulaire avant votre premier rendez-vous : <lien Formulaire>",
      };
      transporter.sendMail(mailMessage, function (error, data) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + data.response);
        }
      });
    }

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array()[0].msg;
      throw error;
    }
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

    if (err.data) {
      err.message = err.data;
    }

    res.status(err.statusCode).json({ message: err.message });
  }
};

exports.patientEdit = async (req, res, next) => {
  const patientId = req.params.patientId;

  //Validation
  try {
    //const errors = validationResult(req);
    //if (!errors.isEmpty()) {
    //const error = new Error("validation failed");
    //error.statusCode = 422;
    //throw error;
    // }

    const patientPrenom = req.body.prenom;
    const patientNom = req.body.nom;
    const patientEmail = req.body.email;
    const patientTel = req.body.tel;
    const patientDateNaissance = req.body.dateNaissance;
    const patientMotifPriseEnCharge = req.body.motifPriseEnCharge;
    const patientAdresse = req.body.adresse;
    const patientCodePostal = req.body.codePostal;
    const patientVille = req.body.ville;

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
    patient.dateNaissance = patient.dateNaissance;
    patient.motifPriseEnCharge = patientMotifPriseEnCharge;
    patient.adresse = patientAdresse;
    patient.codePostal = patientCodePostal;
    patient.ville = patientVille;
    patient.statut = patient.statut;

    const result = await patient.save();
    res.status(200).json({ message: "patient mis a jour", patient: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(err.statusCode).json({ message: err.message });
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
    res.status(err.statusCode).json({ message: err.message });
  }
};

exports.getPatient = async (req, res, next) => {
  try {
    const patientId = req.params.patientId;
    const patient = await Patient.findById(patientId);

    res.status(200).json({ message: "patient trouvé", patient: patient });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(err.statusCode).json({ message: err.message });
  }
};
