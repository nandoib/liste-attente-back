const Patient = require("../models/patient");
const Admin = require("../models/admin");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

exports.patientlogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  Patient.findOne({ email: email })
    .then((patient) => {
      if (!patient) {
        const error = new Error("Pas d'utilisateur avec cette adresse email");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = patient;
      if (loadedUser.password == password) {
        return true;
      }
      return false;
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Mot de passe incorrect");
        error.statusCode = 401;
        throw error;
      }

      const token = jsonwebtoken.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        "secretsecretsecret",
        { expiresIn: "7d" }
      );
      res.status(200).json({
        message: "Vous êtes connecté",
        token: token,
        userId: loadedUser._id.toString(),
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      if (err.data) {
        err.message = err.data;
      }
      res.status(err.statusCode).json({ message: err.message });
    });
};

exports.adminLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  Admin.findOne({ email: email })
    .then((admin) => {
      if (!admin) {
        const error = new Error("Pas d'utilisateur avec cette adresse email");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = admin;
      return bcrypt.compare(password, admin.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Mot de passe incorrect");
        error.statusCode = 401;
        throw error;
      }

      const tokenAdmin = jsonwebtoken.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        "secretsecretsecretadmin",
        { expiresIn: "10h" }
      );
      res.status(200).json({
        message: "Vous êtes connecté",
        tokenAdmin: tokenAdmin,
        userId: loadedUser._id.toString(),
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      if (err.data) {
        err.message = err.data;
      }
      res.status(err.statusCode).json({ message: err.message });
    });
};
