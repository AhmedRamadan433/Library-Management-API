const express = require("express");
const authorsController = require("../controllers/authors.controller");
const { result } = require("express-validator");
const validationSchema = require("../middleware/author.validator.js");
const router = express.Router();
/*
Routes For route : "/authors"
*/
router
  .route("/")
  .get(authorsController.getallAuthors)
  .post(validationSchema(), authorsController.createAuthor);
/// Routes for "/authors"/id"
router
  .route("/:id")
  .get(authorsController.getsingleAuthor)
  .put(validationSchema(), authorsController.updateAuthor)
  .patch(validationSchema(), authorsController.patchAuthor)
  .delete(authorsController.deleteAuthor);
///
module.exports = router;
