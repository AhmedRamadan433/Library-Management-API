const Author = require("../models/Author.model.js");
const HttpStatusText = require("../utils/HttpStatusText");
const AsyncWrapper = require("../middleware/AsyncWrapper");
const AppError = require("../utils/AppError.js");
const handleValidationErrors = require("../utils/handleValidationErrors");
//////get all authors
const getAllAuthors = AsyncWrapper(async (req, res, next) => {
  const authors = await Author.find();
  res.status(200).json({ status: HttpStatusText.SUCCESS, data: authors });
});
///// get author by id
const getSingleAuthor = AsyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const author = await Author.findById(id);
  if (!author) {
    const error = new AppError(404, "Author not found", HttpStatusText.FAIL);
    return next(error);
  }
  res.status(200).json({ status: HttpStatusText.SUCCESS, data: author });
});

///// create new author
const createAuthor = AsyncWrapper(async (req, res, next) => {
  if (handleValidationErrors(req, next)) return;
  const author = await Author.create(req.body);
  res.status(201).json({
    status: HttpStatusText.SUCCESS,
    data: { message: "Author created successfully", author },
  });
});
///// update author by id  (put)
const updateAuthor = AsyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  if (handleValidationErrors(req, next)) return;
  const author = await Author.findOneAndReplace({ _id: id }, req.body);
  if (!author) {
    const error = new AppError(
      404,
      "Failed to update author",
      HttpStatusText.FAIL,
    );
    return next(error);
  }
  res.status(200).json({
    status: HttpStatusText.SUCCESS,
    data: { message: "Author edited successfully", author },
  });
});
///// patch author by id
const patchAuthor = AsyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  if (handleValidationErrors(req, next)) return;
  const author = await Author.findByIdAndUpdate({ _id: id }, req.body, {
    returnDocument: "after",
  });
  if (!author) {
    const error = new AppError(
      404,
      "Failed to update author",
      HttpStatusText.FAIL,
    );
    return next(error);
  }
  res.status(200).json({
    status: HttpStatusText.SUCCESS,
    data: { message: "Author updated successfully", author },
  });
});

//// delete author by id
const deleteAuthor = AsyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const author = await Author.findOneAndDelete({ _id: id });
  if (!author) {
    const error = new AppError(
      404,
      "Failed to delete author",
      HttpStatusText.FAIL,
    );
    return next(error);
  }
  res.status(200).json({
    status: HttpStatusText.SUCCESS,
    data: null,
  });
});

module.exports = {
  getAllAuthors,
  getSingleAuthor,
  createAuthor,
  updateAuthor,
  patchAuthor,
  deleteAuthor,
};
