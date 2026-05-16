const Book = require("../models/Book.model.js");
const HttpStatusText = require("../utils/HttpStatusText");
const AsyncWrapper = require("../middleware/AsyncWrapper");
const AppError = require("../utils/AppError.js");
const handleValidationErrors = require("../utils/handleValidationErrors");
const getAllBooks = AsyncWrapper(async (req, res, next) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 5,
  } = req.query;

  let filter = {};

  // Search
  if (search) {
    filter.title = {
      $regex: search,
      $options: "i",
    };
  }

  // Filter By Category
  if (category) {
    filter.category = category;
  }

  // Filter By Price
  if (minPrice || maxPrice) {
    filter.price = {};

    if (minPrice) {
      filter.price.$gte = minPrice;
    }

    if (maxPrice) {
      filter.price.$lte = maxPrice;
    }
  }

  // Pagination
  const skip = (page - 1) * limit;

  const books = await Book.find(filter)
    .populate("author", "name -_id")
    .populate("category", "name -_id")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: HttpStatusText.SUCCESS,
    data: {
      results: books.length,
      books,
    },
  });
});
/////////////////
const getSingleBook = AsyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  const book = await Book.findById(id)
    .populate("author", "name")
    .populate("category", "name");
  if (!book) {
    const error = new AppError(404, "Book not found", HttpStatusText.FAIL);
    return next(error);
  }
  res.status(200).json({ status: HttpStatusText.SUCCESS, data: book });
});
/////////// Create book
const createBook = AsyncWrapper(async (req, res, next) => {
  if (handleValidationErrors(req, next)) return;
  const data = req.body;
  const book = await Book.create(data);
  res.status(201).json({
    status: HttpStatusText.SUCCESS,
    data: {
      message: "Book Created Successfully",
      book,
    },
  });
});
///////////////// update book by id
const updateBook = AsyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  if (handleValidationErrors(req, next)) return;
  const book = await Book.findByIdAndUpdate({ _id: id }, data, {
    returnDocument: "after",
  });
  if (!book) {
    const error = new AppError(404, "Book not found", HttpStatusText.FAIL);
    return next(error);
  }
  res.status(200).json({
    status: HttpStatusText.SUCCESS,
    data: { message: "Book updated successfully", book },
  });
});
//////////// patch book by id
const replaceBook = AsyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  if (handleValidationErrors(req, next)) return;
  const book = await Book.findOneAndReplace({ _id: id }, data, {
    returnDocument: "after",
  });
  if (!book) {
    const error = new AppError(404, "Book not found", HttpStatusText.FAIL);
    return next(error);
  }
  res.status(200).json({
    status: HttpStatusText.SUCCESS,
    data: { message: "Book replaced successfully", book },
  });
});
//////////////////
const deleteBook = AsyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  const book = await Book.findByIdAndDelete({ _id: id });
  if (!book) {
    const error = new AppError(404, "Book not found", HttpStatusText.FAIL);
    return next(error);
  }
  res.status(200).json({
    status: HttpStatusText.SUCCESS,
    data: null,
  });
});

module.exports = {
  getAllBooks,
  getSingleBook,
  createBook,
  updateBook,
  replaceBook,
  deleteBook,
};
