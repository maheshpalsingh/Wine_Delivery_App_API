const express = require("express");
const app = express();
const orderRouter = express.Router();
const auth = require("../middleware/auth");
const Orders = require("../models/order");
const Products = require("../models/product");

//addtocart
orderRouter.post("/order/:id", async (req, res) => {
  try {
    const findproduct = await Products.find({ _id: req.params.id });
    const ownerid = findproduct[0].owner;
    if (!findproduct) {
      return res.status(404).send("No data");
    }

    // const findorder = await Orders.find({ product: req.params.id });
    // if (findorder) {
    // } else {
    const orders = new Orders({
      productid: req.params.id,
      // owner: req.user._id,
      owner: ownerid,
    });
    orders.productName.push(findproduct[0].name);
    orders.productImage.push(findproduct[0].image);
    orders.productPrice.push(findproduct[0].price);
    await orders.save();
    res.status(201).send({ orders });

    // res.status(201).send({ orders, findproduct });
  } catch (error) {
    res.status(400).send(error);
  }
});

//get my orders
orderRouter.get("/orders/me", async (req, res) => {
  try {
    // const findproduct = await Products.find({ _id: req.params.id });
    // const ownerid = findproduct[0].owner;
    //const products = await Orders.find({ owner: ownerid });
    const products = await Orders.find();
    if (!products) {
      return res.status(404).send("No data");
    }
    res.send(products);
  } catch (error) {
    res.status(404).send(error);
  }
});

//delete
orderRouter.delete("/orders/me/:id", async (req, res) => {
  try {
    const orders = await Orders.findOneAndDelete({
      _id: req.params.id,
      // owner: req.user._id,
    });
    if (!orders) {
      res.status(404).send();
    }
    res.send(orders);
    // res.sendStatus(200)
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = orderRouter;
