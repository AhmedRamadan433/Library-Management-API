const express = require("express");
const Authcontroller = require("../controllers/Auth.controller.js");
const router = express.Router();
router.route("/signup").post(Authcontroller.signup);
router.route("/login").post(Authcontroller.login);
router.route("/forgetPassword").post(Authcontroller.forgetPassword);
router.route("/resetPassword/:token").patch(Authcontroller.resetPassword);
router
  .route("/updateMyPassword")
  .patch(Authcontroller.protect, Authcontroller.updatePassword);
router
  .route("/updatedMe")
  .patch(Authcontroller.protect, Authcontroller.updateMe);
router
  .route("/deleteMe")
  .delete(Authcontroller.protect, Authcontroller.deleteMe);
module.exports = router;
