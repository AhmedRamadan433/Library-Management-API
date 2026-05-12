const Category = require("../models/Category.model.js");
const { validationResult } = require("express-validator");

/// Create Category
const createCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const data = req.body;
  await Category.create(data);
  res.status(201).json({
    message: "Category Created Successfully",
  });
};
///// Get All Categories
const getAllCategories = async (req, res) => {
  const categories = await Category.find();
  res.status(200).json({ status: "success", categories });
};
///// Get Single Category
const getSingleCategory = async (req, res) => {
  const id = req.params.id;
  const category = await Category.findById(id);
  if (!category) {
    return res.status(404).json({ message: "Category Not Found" });
  }
  res.status(200).json({ status: "success", Data: category });
};
///// Update Category (Patch)
const updateCategory = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const category = await Category.findByIdAndUpdate({ _id: id }, data, {
    returnDocument: "after",
  });
  if (!category) {
    return res.status(404).json({ message: "Category Not Found" });
  }
  res.status(200).json({ status: "success", Data: category });
};

//// Replace Category (Put)
const replaceCategory = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const category = await Category.findOneAndReplace({ _id: id }, data,
    { returnDocument: "after" }
  );
  if (!category) {
    return res.status(404).json({ message: "Category Not Found" });
  }
  res.status(200).json({ status: "success", Data: category });
};
//// Delete Category
const deleteCategory = async (req, res) => {
  const id = req.params.id;
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    return res.status(404).json({ message: "Category Not Found" });
  }
  res
    .status(200)
    .json({ status: "success", message: "Category Deleted Successfully" });
};
module.exports = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  replaceCategory,
  deleteCategory,
};
