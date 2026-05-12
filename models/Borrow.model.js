const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    borrowerName: {
      type: String,
      required: true,
      trim: true,
    },

    borrowDate: {
      type: Date,
      default: Date.now,
    },

    returnDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["borrowed", "returned"],
      default: "borrowed",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Borrow = mongoose.model("Borrow", borrowSchema);

module.exports = Borrow;
