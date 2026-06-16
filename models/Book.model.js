const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      //   unique: true,
    },

    description: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 1,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    publishedYear: {
      type: Number,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
