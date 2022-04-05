const express = require("express");
const app = express();
const orderRouters = express.Router();
const auth = require("../middleware/auth");
const Carts = require("../models/cart");
const Orders = require("../models/orders");
const { findOneAndUpdate } = require("../models/product");
const Products = require("../models/product");

//addtocart
orderRouters.post("/placeorder/my", auth, async (req, res) => {
  try {
    const findcart = await Carts.find({
      owner: req.user._id,
    });
    // console.log(findcart);
    let finalAmount = 0;
    let products = [];
    let qty = [];
    let pname = [];
    let price = [];
    findcart.forEach((total, items) => {
      console.log(total);
      products = products.concat(total._id);
      finalAmount = finalAmount + total.qty * total.productPrice[0];
      qty = qty.concat(total.qty);
      console.log("2");
      pname = pname.concat(total.productName[0]);
      price = price.concat(total.productPrice[0]);
    });
    console.log(products, finalAmount, pname, qty, price);
    const updatecart = await Carts.deleteMany({ owner: req.user._id });
    const order = new Orders({
      total: finalAmount,
      products,
      name: pname,
      qty,
      price,
      owner: req.user._id,
    });
    console.log(order);
    await order.save();
    res.status(200).send({ order });
  } catch (error) {
    res.status(400).send(error);
  }
});

//get my orders
orderRouters.get("/orders/my", auth, async (req, res) => {
  try {
    const order = await Orders.find({ owner: req.user._id });
    if (!order) {
      return res.status(404).send("No data");
    }

    res.send(order);
  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = orderRouters;
