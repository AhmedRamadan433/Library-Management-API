const express = require("express");
const Authcontroller = require("../controllers/Auth.controller.js");
const AuthorRoutes = require("./Authors");
const BooksRoutes = require("./books");
const BorrowRoutes = require("./borrow");
const CategoriesRoutes = require("./categories");
const AuthRoutes = require("./Auth.js");
const router = express.Router();
router.use("/users", AuthRoutes);
router.use(Authcontroller.protect);
router.use("/authors", AuthorRoutes);
router.use("/books", BooksRoutes);
router.use("/borrow", BorrowRoutes);
router.use("/categories", CategoriesRoutes);

module.exports = router;
