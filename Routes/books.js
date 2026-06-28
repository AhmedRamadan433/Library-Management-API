const express = require("express");
const BooksController = require("../controllers/books.controller.js");
const bookValidationSchema = require("../middleware/book.validator.js");
const { restrictTo } = require("../controllers/Auth.controller.js");
const router = express.Router();

/*
Routes For "/books"
*/

router
  .route("/")
  .get(BooksController.getAllBooks)
  .post(
    bookValidationSchema.createBookValidationSchema(),
    BooksController.createBook,
  );

/*
Routes For "/books/:id"
*/

router
  .route("/:id")
  .get(BooksController.getSingleBook)
  .put(
    bookValidationSchema.createBookValidationSchema(),
    BooksController.replaceBook,
  )
  .patch(
    bookValidationSchema.updateBookValidationSchema(),
    BooksController.updateBook,
  )
  .delete(restrictTo("admin"), BooksController.deleteBook);

module.exports = router;
