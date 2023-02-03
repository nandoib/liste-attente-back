const Patient = require("../models/patient");
var generator = require("generate-password");

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
