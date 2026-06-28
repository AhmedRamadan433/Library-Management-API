const mongose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { type } = require("os");
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
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
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
    passwordChangedAt: { type: Date, select: false },
    passwordResetToken: String,
    passwordResetExpires: Date,
    Active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { timestamps: true, versionKey: false },
);
userSchema.pre("save", function () {
  if (!this.isModified("password" || this.isNew)) {
    return;
  }
  this.passwordChangedAt = Date.now() - 1000;
  return;
});
////// change pass date
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) {
    return;
  }
  this.passwordChangedAt = Date.now() - 1000;
});
////
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return;
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
////// function to create token
userSchema.methods.FrogetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

///////
userSchema.pre(/^find/, async function (next) {
  if (!this.getOptions().includeInactive) {
    this.find({ Active: true });
  }
});
const User = mongose.model("User", userSchema);
module.exports = User;
