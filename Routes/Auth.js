const express = require("express");
const Authcontroller = require("../controllers/Auth.controller.js");
const router = express.Router();
router.route("/signup").post(Authcontroller.signup);
router.route("/login").post(Authcontroller.login);

module.exports = router;
