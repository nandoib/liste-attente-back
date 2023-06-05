const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const patientRoutes = require("./routes/patient");
const envoiMail = require("./sendValidationMail");
const cron = require("node-cron");

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

//ici les routes
app.use("/admin", adminRoutes);
app.use(patientRoutes);

app.get("/", (req, res) => {
  res.send("Hey this is my API running");
});

cron.schedule("50 2 1 */3 *", () => {
  const mailer = envoiMail.envoi();
});

mongoose.set("strictQuery", true);

mongoose
  .connect(
    "mongodb+srv://nandoibba:" +
      process.env.MONGODB +
      "@cluster0.nwuum.mongodb.net/listeAttente?retryWrites=true&w=majority"
  )

  .then((result) => {
    app.listen(8080);
    console.log("serveur démaré");
  })
  .catch((err) => {
    console.log(err);
  });
