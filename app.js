const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Routes = require("./Routes/All_Routes.js");
const HttpStatusText = require("./utils/HttpStatusText");
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
app.use((req, res, next) => {
  return res.status(404).json({
    status: HttpStatusText.FAIL,
    message: "Page Not Found",
  });
});
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.statustext || HttpStatusText.ERROR,
    message: err.message || "Something Went Wrong",
    errors: err.errors || [],
  });
});
module.exports = app;
