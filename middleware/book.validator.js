const { body } = require("express-validator");

const createBookValidationSchema = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Book title is required")
      .isString()
      .withMessage("Book title must be a string")
      .isLength({ min: 2, max: 100 })
      .withMessage("Book title must be between 2 and 100 characters"),

    body("description")
      .optional()
      .trim()
      .isString()
      .withMessage("Description must be a string")
      .isLength({ min: 10, max: 1000 })
      .withMessage("Description must be between 10 and 1000 characters"),

    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .isFloat({ min: 1, max: 100000 })
      .withMessage("Price must be between 1 and 100000"),

    body("stock")
      .notEmpty()
      .withMessage("Stock is required")
      .isInt({ min: 0, max: 10000 })
      .withMessage("Stock must be between 0 and 10000"),

    body("publishedYear")
      .optional()
      .isInt({
        min: 1900,
        max: new Date().getFullYear(),
      })
      .withMessage("Published year is invalid"),

    body("author")
      .notEmpty()
      .withMessage("Author is required")
      .isMongoId()
      .withMessage("Author must be a valid Mongo ID"),

    body("category")
      .notEmpty()
      .withMessage("Category is required")
      .isMongoId()
      .withMessage("Category must be a valid Mongo ID"),
  ];
};
const updateBookValidationSchema = () => {
  return [
    body("title")
      .optional()
      .trim()
      .isString()
      .withMessage("Book title must be a string")
      .isLength({ min: 2, max: 100 })
      .withMessage("Book title must be between 2 and 100 characters"),

    body("description")
      .optional()
      .trim()
      .isString()
      .withMessage("Description must be a string")
      .isLength({ min: 10, max: 1000 })
      .withMessage("Description must be between 10 and 1000 characters"),

    body("price")
      .optional()
      .isFloat({ min: 1, max: 100000 })
      .withMessage("Price must be between 1 and 100000"),

    body("stock")
      .optional()
      .isInt({ min: 0, max: 10000 })
      .withMessage("Stock must be between 0 and 10000"),

    body("publishedYear")
      .optional()
      .isInt({
        min: 1900,
        max: new Date().getFullYear(),
      })
      .withMessage("Published year is invalid"),

    body("author")
      .optional()
      .isMongoId()
      .withMessage("Author must be a valid Mongo ID"),

    body("category")
      .optional()
      .isMongoId()
      .withMessage("Category must be a valid Mongo ID"),
  ];
};
const bookValidationSchema = {
  createBookValidationSchema,
  updateBookValidationSchema,
};
module.exports = bookValidationSchema;
