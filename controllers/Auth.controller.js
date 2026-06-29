const user = require("../models/user.model.js");
const AsyncWrapper = require("../middleware/AsyncWrapper.js");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError.js");
const sendEmail = require("../utils/NodeMailer.js");
const HttpStatusText = require("../utils/HttpStatusText.js");
const crypto = require("crypto");
const { promisify } = require("util");
const createToken = function (id) {
  return jwt.sign({ id }, process.env.jwt_secret, {
    expiresIn: process.env.jwt_maxage,
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = createToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.jwt_cookie_maxage * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: user,
  });
};
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
const signup = AsyncWrapper(async (req, res, next) => {
  const newUser = await user.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  createSendToken(newUser, 201, res);
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
  const CurrentUser = await user
    .findOne({ email })
    .select("+password")
    .setOptions({ includeInactive: true });
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
  CurrentUser.Active = true;
  await CurrentUser.save({ validateBeforeSave: false });
  createSendToken(CurrentUser, 200, res);
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
  // .setOptions({ includeInactive: true });
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

  const changedpass = freshUser.changedPasswordAfter(decoded.iat);
  if (changedpass) {
    return next(new AppError(401, "Password Has changed", HttpStatusText.FAIL));
  }
  req.user = freshUser;
  next();
});

/////
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          403,
          "You do not have permission to perform this action",
          HttpStatusText.FAIL,
        ),
      );
    }
    next();
  };
};
/////forget password
const forgetPassword = AsyncWrapper(async (req, res, next) => {
  const { email } = req.body;
  /////1- get user based on email
  if (!email) {
    return next(
      new AppError(400, "Please Provide Your Email", HttpStatusText.FAIL),
    );
  }
  const fetchedUser = await user.findOne({ email });
  if (!fetchedUser) {
    return next(
      new AppError(
        404,
        "There is no user with this email",
        HttpStatusText.FAIL,
      ),
    );
  }
  /////2- generate random reset token
  const userToken = fetchedUser.FrogetPasswordToken();

  console.log("userToken:", userToken);
  await fetchedUser.save({ validateBeforeSave: false });
  // 3- send it to user email
  const resetURL = `${req.protocol}://${req.get("host")}/users/forgetPassword/${userToken}`;
  try {
    await sendEmail({
      email: fetchedUser.email,
      subject: "Reset Your Password",
      message: resetURL,
    });
  } catch (err) {
    fetchedUser.passwordResetToken = undefined;
    fetchedUser.passwordResetExpires = undefined;
    await fetchedUser.save({ validateBeforeSave: false });
    return next(
      new AppError(
        500,
        "There was an error sending the email. Try again later!",
        HttpStatusText.FAIL,
      ),
    );
  }
  res.status(200).json({
    status: HttpStatusText.SUCCESS,
    message: "Reset token sent to email",
  });
});
/////////// update password
const resetPassword = AsyncWrapper(async (req, res, next) => {
  /////1- get token from url
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const fetchedUser = await user.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //////2-check if user found or token expired
  if (!fetchedUser) {
    return next(
      new AppError(400, "Token is invalid or has expired", HttpStatusText.FAIL),
    );
  }
  ////3-update password
  fetchedUser.password = req.body.newPass;
  fetchedUser.passwordConfirm = req.body.newPassConfirm;
  fetchedUser.passwordResetToken = undefined;
  fetchedUser.passwordResetExpires = undefined;
  await fetchedUser.save();
  res.status(200).json({
    status: HttpStatusText.SUCCESS,
    message: "Password Updated Successfully",
  });
});
///////// update password for logged in user
const updatePassword = AsyncWrapper(async (req, res, next) => {
  /////1- get user from collection
  const fetcheduser = await user.findById(req.user.id).select("+password");
  /////2- ask for current password and check if it is correct
  if (
    !(await fetcheduser.correct(req.body.CurrentPassword, fetcheduser.password))
  ) {
    return next(
      new AppError(401, "Your current password is wrong", HttpStatusText.FAIL),
    );
  }
  ////3- if so, update password
  fetcheduser.password = req.body.password;
  fetcheduser.passwordConfirm = req.body.passwordConfirm;
  await fetcheduser.save();
  /////4- get new jwt token
  createSendToken(fetcheduser, 200, res);
});

//////////Update user data for logged in user
const updateMe = AsyncWrapper(async (req, res, next) => {
  ////1- create error if user try to update password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        400,
        "This route is not for password update. Please use /updateMyPassword",
        HttpStatusText.FAIL,
      ),
    );
  }
  ///// 2- update user document
  const filteredBody = filterObj(req.body, "name", "email");
  const updatedUser = await user.findByIdAndUpdate(req.user.id, filteredBody, {
    returnDocument: "after",
    runValidators: true,
  });
  createSendToken(updatedUser, 200, res);
});
/////// Delete User {Set inactive}
const deleteMe = AsyncWrapper(async (req, res, next) => {
  const cuserId = req.user.id;

  await user.findByIdAndUpdate(
    cuserId,
    { Active: false },
    { validateBeforeSave: false },
  );
  res.status(204).json({
    status: HttpStatusText.SUCCESS,
    data: null,
  });
});
module.exports = {
  signup,
  login,
  protect,
  restrictTo,
  forgetPassword,
  resetPassword,
  updatePassword,
  updateMe,
  deleteMe,
};
