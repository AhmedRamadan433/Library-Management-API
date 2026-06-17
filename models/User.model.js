const mongose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: true,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Password Not matched",
      },
    },
    passwordChangedAt: Date,
  },
  { timestamps: true, versionKey: false },
);
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return;
  }

  this.passwordChangedAt = Date.now();
  return;
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;
  //   next();
});
userSchema.methods.correct = async function (inputPassword, password) {
  return await bcrypt.compare(inputPassword, password);
};
//////////
userSchema.methods.changedPasswordAfter = function (jwttimestamp) {
  if (this.passwordChangedAt) {
    const passTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return passTimestamp > jwttimestamp;
  }

  return false;
};
///////
const User = mongose.model("User", userSchema);
module.exports = User;
