const express = require("express");
const authorsController = require("../controllers/authors.controller");
const {
  createAuthorValidationSchema,
  updateAuthorValidationSchema,
} = require("../middleware/author.validator.js");
const { restrictTo } = require("../controllers/Auth.controller.js");
const router = express.Router();
/*
Routes For route : "/authors"
*/
router
  .route("/")
  .get(authorsController.getAllAuthors)
  .post(createAuthorValidationSchema(), authorsController.createAuthor);
/// Routes for "/authors"/id"
router
  .route("/:id")
  .get(authorsController.getSingleAuthor)
  .put(createAuthorValidationSchema(), authorsController.updateAuthor)
  .patch(updateAuthorValidationSchema(), authorsController.patchAuthor)
  .delete(restrictTo("admin"), authorsController.deleteAuthor);
///
module.exports = router;
