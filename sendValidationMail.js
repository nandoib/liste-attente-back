const nodeMailer = require("nodemailer");

const Patient = require("./models/patient");

const envoi = async () => {
  let transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: "nandoibba@gmail.com",
      pass: process.env.GMAIL,
    },
  });
  try {
    const patients = await Patient.find();

    patients.map(async (patient) => {
      const singlePatient = await Patient.findById(patient.id);

      const changeStatut = async () => {
        console.log(singlePatient);

        if (singlePatient.statut == "non validé 3") {
          const response = await Patient.findByIdAndRemove(patient.id);
          return;
        }
        if (singlePatient.statut == "non validé 2") {
          singlePatient.statut = "non validé 3";
        }
        if (singlePatient.statut == "non validé 1") {
          singlePatient.statut = "non validé 2";
        }
        if (singlePatient.statut == "valide") {
          singlePatient.statut = "non validé 1";
        }

        await singlePatient.save();
      };
      changeStatut();
    });
  } catch (err) {
    console.log(err);
  }

  const mailMessage = {
    from: "nandoibba@gmail.com ",
    to: "nandoibba@gmail.com",
    subject: "test",
    text: "test",
  };

  transporter.sendMail(mailMessage, function (error, data) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + data.response);
    }
  });
};

module.exports = { envoi };
