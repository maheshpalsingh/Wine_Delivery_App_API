const mongoose = require("mongoose");
const validator = require("validator");
const ProductsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    company: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Products = mongoose.model("Products", ProductsSchema);

module.exports = Products;
