const { body } = require("express-validator");

const categoryValidationSchema = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Category name is required")

      .isString()
      .withMessage("Category name must be a string")

      .isLength({ min: 3, max: 50 })
      .withMessage("Category name must be between 3 and 50 characters"),
  ];
};

module.exports = categoryValidationSchema;
