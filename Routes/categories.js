const express = require("express");
const CategoriesController = require("../controllers/categories.controller.js");
const {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
} = require("../middleware/category.validator.js");
const { restrictTo } = require("../controllers/Auth.controller.js");
const router = express.Router();

/*
Routes For "/categories"
*/

router
  .route("/")
  .get(CategoriesController.getAllCategories)
  .post(createCategoryValidationSchema(), CategoriesController.createCategory);

/*
Routes For "/categories/:id"
*/

router
  .route("/:id")
  .get(CategoriesController.getSingleCategory)
  .put(createCategoryValidationSchema(), CategoriesController.replaceCategory)
  .patch(updateCategoryValidationSchema(), CategoriesController.updateCategory)
  .delete(restrictTo("admin"), CategoriesController.deleteCategory);

module.exports = router;
