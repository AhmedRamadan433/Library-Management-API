const Category = require("../models/Category.model.js");
const { validationResult } = require("express-validator");
const HttpStatusText = require("../utils/HttpStatusText");
/// Create Category
const createCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: HttpStatusText.FAIL,
      data: { errors: errors.array() },
    });
  }
  const data = req.body;
  const category = await Category.create(data);
  res.status(201).json({
    status: HttpStatusText.SUCCESS,
    data: {
      category,
    },
  });
};
///// Get All Categories
const getAllCategories = async (req, res) => {
  const categories = await Category.find();
  res
    .status(200)
    .json({ status: HttpStatusText.SUCCESS, data: { categories } });
};
///// Get Single Category
const getSingleCategory = async (req, res) => {
  const id = req.params.id;
  const category = await Category.findById(id);
  if (!category) {
    return res.status(404).json({
      status: HttpStatusText.FAIL,
      data: { Category: "Category Not Found" },
    });
  }
  res.status(200).json({ status: HttpStatusText.SUCCESS, data: { category } });
};
///// Update Category (Patch)
const updateCategory = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const category = await Category.findByIdAndUpdate({ _id: id }, data, {
    returnDocument: "after",
  });
  if (!category) {
    return res.status(404).json({
      status: HttpStatusText.FAIL,
      data: { Category: "Category Not Found" },
    });
  }
  res.status(200).json({ status: HttpStatusText.SUCCESS, data: { category } });
};

//// Replace Category (Put)
const replaceCategory = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const category = await Category.findOneAndReplace({ _id: id }, data, {
    returnDocument: "after",
  });
  if (!category) {
    return res.status(404).json({
      status: HttpStatusText.FAIL,
      data: { Category: "Category Not Found" },
    });
  }
  res.status(200).json({ status: HttpStatusText.SUCCESS, data: { category } });
};
//// Delete Category
const deleteCategory = async (req, res) => {
  const id = req.params.id;
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    return res.status(404).json({
      status: HttpStatusText.FAIL,
      data: { Category: "Category Not Found" },
    });
  }
  res.status(200).json({
    status: HttpStatusText.SUCCESS,
    data: null,
  });
};
module.exports = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  replaceCategory,
  deleteCategory,
};
