const { body } = require("express-validator");

const authorValidationSchema = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Author name is required")

      .isString()
      .withMessage("Author name must be a string")

      .isLength({ min: 3, max: 50 })
      .withMessage("Author name must be between 3 and 50 characters"),

    body("bio")
      .optional()
      .trim()

      .isString()
      .withMessage("Bio must be a string")

      .isLength({ min: 10, max: 300 })
      .withMessage("Bio must be between 10 and 300 characters"),

    body("birthDate")
      .optional()

      .isDate()
      .withMessage("Birth date must be a valid date"),
  ];
};

module.exports = authorValidationSchema;
