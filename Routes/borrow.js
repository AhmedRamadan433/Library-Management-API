const express = require("express");
const BorrowController = require("../controllers/borrow.controller");
const borrowValidationSchema = require("../middleware/borrow.validator.js");
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

router.route("/:id/return").patch(BorrowController.returnBook);
router.route("/:id").get(BorrowController.getBorrowById);

module.exports = router;
