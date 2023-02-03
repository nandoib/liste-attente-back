const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const patientSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    tel: { type: String, required: true },

    password: {
      type: String,
      required: true,
    },

    dateNaissance: {
      type: Date,
      required: true,
    },

    motifPriseEnCharge: {
      type: String,
      required: true,
    },

    adresse: {
      type: String,
      required: true,
    },

    codePostal: {
      type: String,
      required: true,
    },

    ville: { type: String, required: true },

    nom: {
      type: String,
      required: true,
    },

    prenom: { type: String, required: true },
    statut: { type: String, required: true },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
