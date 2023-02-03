const nodeMailer = require("nodemailer");

const Patient = require("./models/patient");

const envoi = async () => {
  try {
    const patients = await Patient.find();

    patients.map(async (patient) => {
      const singlePatient = await Patient.findById(patient.id);
      if (singlePatient.statut == "non validé 1") {
        singlePatient.statut = "non validé 2";
        const result = await singlePatient.save();
      }

      if (singlePatient.statut == "non validé 2") {
        singlePatient.statut = "non validé 3";
        const result = await singlePatient.save();
      }

      if (singlePatient.statut == "non validé 3") {
        await Patient.findByIdAndRemove(singlePatient.id);
      }
    });
  } catch (err) {
    console.log(err);
  }

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
