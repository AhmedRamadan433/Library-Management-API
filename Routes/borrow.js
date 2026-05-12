const express = require("express");
const BorrowController = require("../Controllers/borrow.controller");
borrowValidationSchema = require("../middleware/borrow.validator.js");
const router = express.Router();

/*
Routes For "/borrow"
*/

router
  .route("/")
  .get(BorrowController.getAllBorrows)
  .post(borrowValidationSchema(), BorrowController.borrowBook);

/*
Route For Returning Book
*/

router
  .route("/:id/return")
  .patch(borrowValidationSchema(), BorrowController.returnBook);

module.exports = router;
