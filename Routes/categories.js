const express = require("express");
const CategoriesController = require("../controllers/categories.controller.js");
const categoryValidationSchema = require("../middleware/category.validator.js");
const router = express.Router();

/*
Routes For "/categories"
*/

router
  .route("/")
  .get(CategoriesController.getAllCategories)
  .post(categoryValidationSchema(), CategoriesController.createCategory);

/*
Routes For "/categories/:id"
*/

router
  .route("/:id")
  .get(CategoriesController.getSingleCategory)
  .put(categoryValidationSchema(), CategoriesController.replaceCategory)
  .patch(categoryValidationSchema(), CategoriesController.updateCategory)
  .delete(CategoriesController.deleteCategory);

module.exports = router;
