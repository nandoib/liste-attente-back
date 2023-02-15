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

    formulaire: {
      numeroSecu: { type: Number },
      classe: { type: String },
      ecole: { type: String },
      ecoleVille: { type: String },
      difficultes: { type: String },
      suivis: { type: String },
      agePremierMots: { type: String },
      comprehension: { type: Boolean },
      expression: { type: Boolean },
      rampage: { type: Boolean },
      pattes: { type: Boolean },
      agePremierPas: { type: String },
      autonome: { type: Boolean },
      lunettes: { type: Boolean },
      testOrl: { type: Boolean },
      hyper: { type: Boolean },
      ageProprete: { type: String },
      repas: { type: String },
      sommeil: { type: String },
      peurs: { type: String },
      activites: { type: String },
      relations: { type: String },
    },
    rendezVous: [{ type: Date }],
  },

  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
