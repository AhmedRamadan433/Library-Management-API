const Book = require("../models/Book.model.js");
const { validationResult } = require("express-validator");
const HttpStatusText = require("../utils/HttpStatusText");

const getAllBooks = async (req, res) => {
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
};
/////////////////
const getSingleBook = async (req, res) => {
  const id = req.params.id;
  const book = await Book.findById(id)
    .populate("author", "name")
    .populate("category", "name");
  if (!book) {
    return res
      .status(404)
      .json({ status: HttpStatusText.FAIL, data: { Book: "Book Not Found" } });
  }
  res.status(200).json({ status: HttpStatusText.SUCCESS, data: book });
};

const createBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ status: HttpStatusText.FAIL, data: { errors: errors.array() } });
  }
  const data = req.body;
  await Book.create(data);

  res.status(201).json({
    status: HttpStatusText.SUCCESS,
    data: {
      message: "Book Created Successfully",
      book,
    },
  });
};
/////////////////
const updateBook = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const book = await Book.findByIdAndUpdate({ _id: id }, data, {
    returnDocument: "after",
  });
  if (!book) {
    return res
      .status(404)
      .json({ status: HttpStatusText.FAIL, data: { Book: "Book Not Found" } });
  }
  res.status(200).json({
    status: HttpStatusText.SUCCESS,
    data: { message: "Book updated successfully", book },
  });
};
////////////
const replaceBook = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const book = await Book.findOneAndReplace({ _id: id }, data, {
    returnDocument: "after",
  });
  if (!book) {
    return res
      .status(404)
      .json({ status: HttpStatusText.FAIL, data: { Book: "Book Not Found" } });
  }
  res.status(200).json({
    status: HttpStatusText.SUCCESS,
    data: { message: "Book replaced successfully", book },
  });
};
//////////////////
const deleteBook = async (req, res) => {
  const id = req.params.id;
  const book = await Book.findByIdAndDelete({ _id: id });
  if (!book) {
    return res
      .status(404)
      .json({ status: HttpStatusText.FAIL, data: { Book: "Book Not Found" } });
  }
  res.status(200).json({
    status: HttpStatusText.SUCCESS,
    data: null,
  });
};

module.exports = {
  getAllBooks,
  getSingleBook,
  createBook,
  updateBook,
  replaceBook,
  deleteBook,
};
