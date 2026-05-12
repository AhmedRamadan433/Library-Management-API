const express = require("express");
const BooksController = require("../controllers/books.controller.js");
const bookValidationSchema = require("../middleware/book.validator.js");
const router = express.Router();

/*
Routes For "/books"
*/

router
  .route("/")
  .get(BooksController.getAllBooks)
  .post(bookValidationSchema(), BooksController.createBook);

/*
Routes For "/books/:id"
*/

router
  .route("/:id")
  .get(BooksController.getSingleBook)
  .put(bookValidationSchema(), BooksController.updateBook)
  .patch(bookValidationSchema(), BooksController.replaceBook)
  .delete(BooksController.deleteBook);

module.exports = router;
