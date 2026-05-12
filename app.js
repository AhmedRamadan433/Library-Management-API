const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Routes = require("./Routes/All_Routes.js");
////
const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
////
app.use(Routes);
app.get("/", (req, res) => {
  console.log("APP Is Running");
  res.end();
});

module.exports = app;
