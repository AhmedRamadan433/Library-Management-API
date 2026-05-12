const express = require("express");

const AuthorRoutes = require("./Authors");
const BooksRoutes = require("./books");
const BorrowRoutes = require("./borrow");
const CategoriesRoutes = require("./categories");

const router = express.Router();

router.use("/authors", AuthorRoutes);
router.use("/books", BooksRoutes);
router.use("/borrow", BorrowRoutes);
router.use("/categories", CategoriesRoutes);

module.exports = router;
