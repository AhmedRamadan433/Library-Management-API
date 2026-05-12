const Borrow = require("../models/borrow.model");
const Book = require("../models/Book.model");

//// Get All Borrows
const getAllBorrows = async (req, res) => {
  const borrows = await Borrow.find().populate("book", "title -_id");

  if (borrows.length === 0) {
    return res.status(404).json({
      status: "fail",
      message: "No borrows found",
    });
  }

  res.status(200).json({
    status: "success",
    results: borrows.length,
    data: borrows,
  });
};

//// Borrow Book
const borrowBook = async (req, res) => {
  const { bookId, borrowerName } = req.body;

  // Check Book Exists
  const book = await Book.findById(bookId);

  if (!book) {
    return res.status(404).json({
      status: "fail",
      message: "Book not found",
    });
  }

  // Check Stock
  if (book.stock <= 0) {
    return res.status(400).json({
      status: "fail",
      message: "Book is out of stock",
    });
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
    status: "success",
    data: borrow,
  });
};

//// Return Book
const returnBook = async (req, res) => {
  const { id } = req.params;

  // Find Borrow Record
  const borrow = await Borrow.findById(id);

  if (!borrow) {
    return res.status(404).json({
      status: "fail",
      message: "Borrow record not found",
    });
  }

  // Prevent Returning Twice
  if (borrow.status === "returned") {
    return res.status(400).json({
      status: "fail",
      message: "Book already returned",
    });
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
    status: "success",
    data: borrow,
  });
};

module.exports = {
  getAllBorrows,
  borrowBook,
  returnBook,
};
