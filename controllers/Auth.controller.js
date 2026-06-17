const user = require("../models/user.model.js");
const AsyncWrapper = require("../middleware/AsyncWrapper.js");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError.js");
const HttpStatusText = require("../utils/HttpStatusText.js");
const { promisify } = require("util");
const createToken = function (id) {
  return jwt.sign({ id }, process.env.jwt_secret, {
    expiresIn: process.env.jwt_maxage,
  });
};

const signup = AsyncWrapper(async (req, res, next) => {
  const newUser = await user.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = createToken(newUser._id);
  res.status(201).json({ status: "success", token, data: newUser });
});
///// log in
const login = AsyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  ////1- check input email and pass
  if (!email || !password) {
    const error = new AppError(
      400,
      "Please Provide Email and Password",
      HttpStatusText.FAIL,
    );
    return next(error);
  }
  ///2- check is user exist (wrong email) || wrong password
  const CurrentUser = await user.findOne({ email }).select("+password");
  if (
    !CurrentUser ||
    !(await CurrentUser.correct(password, CurrentUser.password))
  ) {
    const error = new AppError(
      401,
      "Please Enter Correct Email and Password",
      HttpStatusText.FAIL,
    );
    return next(error);
  }
  ////3- input are correct
  const token = createToken(CurrentUser._id);
  res.status(200).json({ status: "success", token });
});
//////protect
const protect = AsyncWrapper(async (req, res, next) => {
  ///1- get token
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer")) {
    return next(new AppError(401, "No token deteced", HttpStatusText.FAIL));
  }
  const token = header.split(" ")[1];
  /////2- verify it
  const decoded = await promisify(jwt.verify)(token, process.env.jwt_secret);
  if (!decoded) {
    return next(new AppError(401, "token Expired", HttpStatusText.FAIL));
  }

  ///3- chek user is exist
  const freshUser = await user.findById(decoded.id);
  // console.log(freshUser._id);

  if (!freshUser) {
    return next(
      new AppError(
        401,
        "User belong to this token is not exisit",
        HttpStatusText.FAIL,
      ),
    );
  }
  ///4-check password has changed
  console.log(decoded);

  const changedpass = freshUser.changedPasswordAfter(decoded.iat);
  if (changedpass) {
    return next(new AppError(401, "Password Has changed", HttpStatusText.FAIL));
  }
  req.user = freshUser;
  next();
});
module.exports = { signup, login, protect };
