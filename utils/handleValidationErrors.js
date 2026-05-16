const { validationResult } = require("express-validator");
const AppError = require("../utils/AppError");
const HttpStatusText = require("../utils/HttpStatusText");
module.exports = (req, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new AppError(400, "Validation failed", HttpStatusText.FAIL);
    error.errors = errors.array();
    return next(error);
  }
  return null;
};
