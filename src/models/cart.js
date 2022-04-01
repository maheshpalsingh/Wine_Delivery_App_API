const mongoose = require("mongoose");
const CartsSchema = new mongoose.Schema(
  {
    qty: {
      type: Number,
      required: true,
      // default: 1,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    productid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    productName: [
      {
        type: Object,
        addBy: { type: String, ref: "Product" },
      },
    ],
    productImage: [
      {
        type: Object,
        addBy: { type: String, ref: "Product" },
      },
    ],
    productPrice: [
      {
        type: Number,
        addBy: { type: Number, ref: "Product" },
      },
    ],
  },
  { timestamps: true }
);
const Carts = mongoose.model("Carts", CartsSchema);

module.exports = Carts;
