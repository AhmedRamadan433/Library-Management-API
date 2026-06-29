const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
// const mongosanitize = require("express-mongo-sanitize");
// const xss = require("xss-clean");
const hpp = require("hpp");
const { rateLimit } = require("express-rate-limit");
const Routes = require("./Routes/All_Routes.js");
const HttpStatusText = require("./utils/HttpStatusText");
////
const app = express();
app.use(helmet());
app.use(hpp());
// app.use(mongosanitize());
// app.use(xss());
///////Rate limit
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many Requests from this IP, Please try again in an hour",
});
//////
app.use(limiter);
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
  let errors = [];

  if (err.name === "ValidationError") {
    console.log("Validation Error");
    return res.status(400).json({
      status: "FAIL",
      errName: err.name,
      message: Object.values(err.errors)
        .map((el) => el.message)
        .join(", "),
    });
  }
  res.status(err.statusCode || 500).json({
    status: err.statustext || HttpStatusText.ERROR,
    message: err.message || "Something Went Wrong",
    errors: err.errors || [],
  });
});
module.exports = app;
