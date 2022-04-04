const mongoose = require("mongoose");
const OrdersSchema = new mongoose.Schema(
  {
    total: {
      type: Number,
      required: true,
      // default: 1,
      trim: true,
    },
    products: [
      {
        type: Object,
        addBy: { type: String, ref: "Carts" },
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);
const Orders = mongoose.model("Orders", OrdersSchema);

module.exports = Orders;
