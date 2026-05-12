const mongoose = require("mongoose");
const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      // uniqe=true
    },

    bio: {
      type: String,
      trim: true,
    },

    birthDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
const Author = mongoose.model("Author", authorSchema);
module.exports = Author;
