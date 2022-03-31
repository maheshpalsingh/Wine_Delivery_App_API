const express = require("express");
const app = express();
const orderRouter = express.Router();
const auth = require("../middleware/auth");
const Orders = require("../models/order");
const { findOneAndUpdate } = require("../models/product");
const Products = require("../models/product");

//addtocart
orderRouter.post("/order/:id", auth, async (req, res) => {
  try {
    const findproduct = await Products.find({
      _id: req.params.id,
    });
    // const ownerid = findproduct[0].owner;
    console.log(req.params.id);
    if (!findproduct) {
      return res.status(404).send("No data");
    }
    const findorder = await Orders.find({
      productid: req.params.id,
      owner: req.user._id,
    });
    let preqty = 0;
    if (findorder.length !== 0) {
      console.log("already in", findorder);
      await Orders.findOneAndDelete({ _id: findorder[0]._id });
      preqty = findorder[0].qty + 1;
    } else {
      preqty = 1;
    }
    const orders = new Orders({
      qty: preqty,
      productid: req.params.id,
      owner: req.user._id,
      //owner: ownerid,
    });
    orders.productName.push(findproduct[0].name);
    orders.productImage.push(findproduct[0].image);
    orders.productPrice.push(findproduct[0].price);
    await orders.save();
    res.status(201).send({ orders });
    console.log("db-----", orders.qty);
    // res.status(201).send({ orders, findproduct });
  } catch (error) {
    res.status(400).send(error);
  }
});

//get my orders
orderRouter.get("/orders/me", auth, async (req, res) => {
  try {
    const products = await Orders.find({ owner: req.user._id });
    //const products = await Orders.find();
    if (!products) {
      return res.status(404).send("No data");
    }
    res.send(products);
  } catch (error) {
    res.status(404).send(error);
  }
});

//delete
orderRouter.delete("/orders/me/:id", auth, async (req, res) => {
  try {
    let orderforupdate = await Orders.find({ _id: req.params.id });
    if (!orderforupdate) {
      console.log("not found");
    }
    let orderqty = orderforupdate[0].qty;
    console.log("Qty------", orderqty);
    if (orderqty === 1) {
      console.log("delete");
      const orders = await Orders.findOneAndDelete({
        _id: req.params.id,
        // owner: req.user._id,
      });
      if (!orders) {
        res.status(404).send();
      }
      res.send(orders);
      res.sendStatus(200);
    } else {
      console.log("update");
      let newqty = orderqty - 1;
      console.log("new qty", newqty);
      const filter = { _id: req.params.id };
      const update = { qty: newqty };
      const updateqty = await Orders.findOneAndUpdate(filter, update);
      await updateqty.save();
      res.status(200);
    }
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = orderRouter;
