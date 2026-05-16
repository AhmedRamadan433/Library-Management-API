const Category = require("../models/Category.model.js");
const HttpStatusText = require("../utils/HttpStatusText");
const AsyncWrapper = require("../middleware/AsyncWrapper");
const AppError = require("../utils/AppError.js");
const handleValidationErrors = require("../utils/handleValidationErrors");
/// Create Category
const createCategory = AsyncWrapper(async (req, res, next) => {
  if (handleValidationErrors(req, next)) return;
  const data = req.body;
  const category = await Category.create(data);
  res.status(201).json({
    status: HttpStatusText.SUCCESS,
    data: category,
  });
});
///// Get All Categories
const getAllCategories = AsyncWrapper(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({ status: HttpStatusText.SUCCESS, data: categories });
});
///// Get Single Category
const getSingleCategory = AsyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  const category = await Category.findById(id);
  if (!category) {
    const error = new AppError(404, "Category not found", HttpStatusText.FAIL);
    return next(error);
  }
  res.status(200).json({ status: HttpStatusText.SUCCESS, data: category });
});
///// Update Category (Patch)
const updateCategory = AsyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  if (handleValidationErrors(req, next)) return;
  const category = await Category.findByIdAndUpdate({ _id: id }, data, {
    returnDocument: "after",
  });
  if (!category) {
    const error = new AppError(404, "Category not found", HttpStatusText.FAIL);
    return next(error);
  }
  res.status(200).json({ status: HttpStatusText.SUCCESS, data: category });
});

//// Replace Category (Put)
const replaceCategory = AsyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  if (handleValidationErrors(req, next)) return;
  const category = await Category.findOneAndReplace({ _id: id }, data, {
    returnDocument: "after",
  });
  if (!category) {
    const error = new AppError(404, "Category not found", HttpStatusText.FAIL);
    return next(error);
  }
  res.status(200).json({ status: HttpStatusText.SUCCESS, data: category });
});
//// Delete Category
const deleteCategory = AsyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    const error = new AppError(404, "Category not found", HttpStatusText.FAIL);
    return next(error);
  }
  res.status(200).json({
    status: HttpStatusText.SUCCESS,
    data: null,
  });
});
module.exports = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  replaceCategory,
  deleteCategory,
};
