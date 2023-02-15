const Patient = require("../models/patient");
const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const cron = require("node-cron");
const nodeMailer = require("nodemailer");

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

exports.addRendezvous = async (req, res, next) => {
  try {
    const rendezVous = req.body.date;
    const patientId = req.params.patientId;
    const patient = await Patient.findById(patientId);

    const returnDateLocal = (date) => {
      const dateFr = new Date(date);
      return (
        dateFr.toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }) +
        " à " +
        dateFr.toLocaleTimeString("fr-FR")
      );
    };

    const dateToCron = (date) => {
      let minutes = date.getMinutes();
      let hours = date.getHours();
      let days = date.getDate() - 1;
      let months = date.getMonth() + 1;
      let dayOfWeek = "*";

      if (days == "0") {
        days = "29";
        months = months - 1;
      }
      return `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
    };

    let dateRdv = new Date(rendezVous);

    cron.schedule(dateToCron(dateRdv), () => {
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
        subject:
          "Rappel du rendez-vous orthophonie du " + returnDateLocal(rendezVous),
        text: "Bonjour, un rendez vous est programmé avec votre orthophoniste le ",
      };
      transporter.sendMail(mailMessage, function (error, data) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + data.response);
        }
      });
    });

    patient.rendezVous.push(rendezVous);
    await patient.save();
    res
      .status(201)
      .json({ message: "rendezVous enregistré", patient: patient });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(err.statusCode).json({ message: err.message });
  }
};

exports.getAllRendezVousPatient = async (req, res, next) => {
  try {
    const patientId = req.params.patientId;

    const patient = await Patient.findById(patientId);
    const rendezVous = patient.rendezVous;

    res.status(200).json({ rendezVous: rendezVous });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};
