const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated !");
    error.statusCode = 401;
    throw error;
  }
  const tokenAdmin = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(tokenAdmin, "secretsecretsecretadmin");
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
