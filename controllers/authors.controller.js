const { validationResult } = require("express-validator");
const Author = require("../models/author.model");

//////get all authors
const getallAuthors = async (req, res) => {
  const authors = await Author.find();
  res.status(200).json(authors);
};
///// get author by id
const getsingleAuthor = async (req, res) => {
  const { id } = req.params;
  const author = await Author.findById(id);
  if (!author) {
    return res.status(404).json({ message: "Author not found" });
  }
  res.status(200).json(author);
};
///// create new author
const createAuthor = async (req, res) => {
  const results = validationResult(req);
  if (!results.isEmpty()) {
    return res.status(400).json({ errors: results.array() });
  }
  const author = await Author.create(req.body);
  res
    .status(201)
    .json({ message: "Author created successfully", data: author });
};
///// update author by id  (put)
const updateAuthor = async (req, res) => {
  const { id } = req.params;
  const results = validationResult(req);
  if (!results.isEmpty()) {
    return res.status(400).json({ errors: results.array() });
  }
  const author = await Author.findOneAndReplace({ _id: id }, req.body);
  if (!author) {
    return res.status(404).json({ message: "Author not found" });
  }
  res.status(200).json({ message: "Author edited successfully", author });
};
///// patch author by id
const patchAuthor = async (req, res) => {
  const { id } = req.params;
  const results = validationResult(req);
  if (!results.isEmpty()) {
    return res.status(400).json({ errors: results.array() });
  }
  const author = await Author.findByIdAndUpdate({ _id: id }, req.body, {
    returnDocument: "after",
  });
  if (!author) {
    return res.status(404).json({ message: "Author not found" });
  }
  res.status(200).json({ message: "Author updated successfully", author });
};

//// delete author by id
const deleteAuthor = async (req, res) => {
  const { id } = req.params;
  const author = await Author.findOneAndDelete({ _id: id });
  if (!author) {
    return res.status(404).json({ message: "Author not found" });
  }
  res.status(200).json({ message: "Author deleted successfully" });
};

module.exports = {
  getallAuthors,
  getsingleAuthor,
  createAuthor,
  updateAuthor,
  patchAuthor,
  deleteAuthor,
};
