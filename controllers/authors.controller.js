const { validationResult } = require("express-validator");
const Author = require("../models/author.model");
const HttpStatusText = require("../utils/HttpStatusText");
//////get all authors
const getallAuthors = async (req, res) => {
  const authors = await Author.find();
  res.status(200).json({ status: HttpStatusText.SUCCESS, data: authors });
};
///// get author by id
const getsingleAuthor = async (req, res) => {
  const { id } = req.params;
  const author = await Author.findById(id);
  if (!author) {
    return res.status(404).json({
      status: HttpStatusText.FAIL,
      data: { message: "Author not found" },
    });
  }
  res.status(200).json({ status: HttpStatusText.SUCCESS, data: author });
};
///// create new author
const createAuthor = async (req, res) => {
  const results = validationResult(req);
  if (!results.isEmpty()) {
    return res.status(400).json({
      status: HttpStatusText.FAIL,
      data: { errors: results.array() },
    });
  }
  const author = await Author.create(req.body);
  if (!author) {
    return res.status(400).json({
      status: HttpStatusText.ERROR,
      message: "Failed to create author",
    });
  }
  res.status(201).json({
    status: HttpStatusText.SUCCESS,
    data: { message: "Author created successfully", data: author },
  });
};
///// update author by id  (put)
const updateAuthor = async (req, res) => {
  const { id } = req.params;
  const results = validationResult(req);
  if (!results.isEmpty()) {
    return res.status(400).json({
      status: HttpStatusText.FAIL,
      data: { errors: results.array() },
    });
  }
  const author = await Author.findOneAndReplace({ _id: id }, req.body);
  if (!author) {
    return res.status(404).json({
      status: HttpStatusText.FAIL,
      data: { message: "Author not found" },
    });
  }
  res.status(200).json({
    status: HttpStatusText.SUCCESS,
    data: { message: "Author edited successfully", data: author },
  });
};
///// patch author by id
const patchAuthor = async (req, res) => {
  const { id } = req.params;
  const results = validationResult(req);
  if (!results.isEmpty()) {
    return res.status(400).json({
      status: HttpStatusText.FAIL,
      data: { errors: results.array() },
    });
  }
  const author = await Author.findByIdAndUpdate({ _id: id }, req.body, {
    returnDocument: "after",
  });
  if (!author) {
    return res.status(404).json({
      status: HttpStatusText.FAIL,
      data: { message: "Author not found" },
    });
  }
  res.status(200).json({
    status: HttpStatusText.SUCCESS,
    data: { message: "Author updated successfully", data: author },
  });
};

//// delete author by id
const deleteAuthor = async (req, res) => {
  const { id } = req.params;
  const author = await Author.findOneAndDelete({ _id: id });
  if (!author) {
    return res.status(404).json({
      status: HttpStatusText.FAIL,
      data: { message: "Author not found" },
    });
  }
  res.status(200).json({
    status: HttpStatusText.SUCCESS,
    data: null,
  });
};

module.exports = {
  getallAuthors,
  getsingleAuthor,
  createAuthor,
  updateAuthor,
  patchAuthor,
  deleteAuthor,
};
