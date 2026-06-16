const Borrow = require("../models/Borrow.model.js");
const Book = require("../models/Book.model");
const HttpStatusText = require("../utils/HttpStatusText");
const AsyncWrapper = require("../middleware/AsyncWrapper");
const AppError = require("../utils/AppError.js");
const handleValidationErrors = require("../utils/handleValidationErrors");
//// Get All Borrows
const getAllBorrows = AsyncWrapper(async (req, res, next) => {
  const borrows = await Borrow.find().populate("book", "title -_id");
  res.status(200).json({
    status: HttpStatusText.SUCCESS,
    data: {
      results: borrows.length,
      borrows,
    },
  });
});
//// get single borrow
const getBorrowById = AsyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const borrow = await Borrow.findById(id).populate("book", "title -_id");
  if (!borrow) {
    const error = new AppError(
      404,
      "Borrow record not found",
      HttpStatusText.FAIL,
    );
    return next(error);
  }
  res.status(200).json({
    status: HttpStatusText.SUCCESS,
    data: borrow,
  });
});
//// Borrow Book
const borrowBook = AsyncWrapper(async (req, res, next) => {
  const { bookId, borrowerName } = req.body;
  // Check Book Exists
  if (handleValidationErrors(req, next)) return;
  const book = await Book.findById(bookId);

  if (!book) {
    const error = new AppError(404, "Book not found", HttpStatusText.FAIL);
    return next(error);
  }

  // Check Stock
  if (book.stock <= 0) {
    const error = new AppError(400, "Book out of stock", HttpStatusText.FAIL);
    return next(error);
  }

  // Decrease Stock
  book.stock -= 1;

  await book.save();

  // Create Borrow Record
  const borrow = await Borrow.create({
    book: book._id,
    borrowerName,
  });

  res.status(201).json({
    status: HttpStatusText.SUCCESS,
    data: borrow,
  });
});
//////////////////// Return Book
const returnBook = AsyncWrapper(async (req, res, next) => {
  if (handleValidationErrors(req, next)) return;
  const { id } = req.params;

  // Find Borrow Record
  const borrow = await Borrow.findById(id);

  if (!borrow) {
    const error = new AppError(
      404,
      "Borrow record not found",
      HttpStatusText.FAIL,
    );
    return next(error);
  }

  // Prevent Returning Twice
  if (borrow.status === "returned") {
    const error = new AppError(
      400,
      "Book already returned",
      HttpStatusText.FAIL,
    );
    return next(error);
  }

  // Update Borrow Record
  borrow.status = "returned";

  borrow.returnDate = Date.now();

  await borrow.save();

  // Increase Book Stock
  const book = await Book.findById(borrow.book);

  if (book) {
    book.stock += 1;

    await book.save();
  }

  res.status(200).json({
    status: HttpStatusText.SUCCESS,
    data: borrow,
  });
});

module.exports = {
  getAllBorrows,
  getBorrowById,
  borrowBook,
  returnBook,
};
