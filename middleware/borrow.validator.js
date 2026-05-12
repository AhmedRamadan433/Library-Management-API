const { body } = require("express-validator");

const borrowValidationSchema = () => {
  return [
    body("bookId")
      .notEmpty()
      .withMessage("Book ID is required")

      .isMongoId()
      .withMessage("Book ID must be a valid Mongo ID"),

    body("borrowerName")
      .trim()
      .notEmpty()
      .withMessage("Borrower name is required")

      .isString()
      .withMessage("Borrower name must be a string")

      .isLength({ min: 3, max: 50 })
      .withMessage("Borrower name must be between 3 and 50 characters"),
  ];
};

module.exports = borrowValidationSchema;
