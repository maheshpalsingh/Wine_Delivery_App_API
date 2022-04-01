const express = require("express");
const app = express();
const cartRouter = express.Router();
const auth = require("../middleware/auth");
const Carts = require("../models/cart");
const { findOneAndUpdate } = require("../models/product");
const Products = require("../models/product");

//addtocart
cartRouter.post("/cart/:id", auth, async (req, res) => {
  try {
    const findproduct = await Products.find({
      _id: req.params.id,
    });
    // const ownerid = findproduct[0].owner;
    console.log(req.params.id);
    if (!findproduct) {
      return res.status(404).send("No data");
    }
    const findcart = await Carts.find({
      productid: req.params.id,
      owner: req.user._id,
    });
    let preqty = 0;
    if (findcart.length !== 0) {
      console.log("already in", findcart);
      await Carts.findOneAndDelete({ _id: findcart[0]._id });
      preqty = findcart[0].qty + 1;
    } else {
      preqty = 1;
    }
    const carts = new Carts({
      qty: preqty,
      productid: req.params.id,
      owner: req.user._id,
      //owner: ownerid,
    });
    carts.productName.push(findproduct[0].name);
    carts.productImage.push(findproduct[0].image);
    carts.productPrice.push(findproduct[0].price);
    await carts.save();
    res.status(201).send({ carts });
    console.log("db-----", carts.qty);
    // res.status(201).send({ carts, findproduct });
  } catch (error) {
    res.status(400).send(error);
  }
});

//get my carts
cartRouter.get("/carts/me", auth, async (req, res) => {
  try {
    const products = await Carts.find({ owner: req.user._id });
    //const products = await Carts.find();
    if (!products) {
      return res.status(404).send("No data");
    }
    res.send(products);
  } catch (error) {
    res.status(404).send(error);
  }
});

//delete
cartRouter.delete("/carts/me/:id", auth, async (req, res) => {
  try {
    let cartforupdate = await Carts.find({ _id: req.params.id });
    if (!cartforupdate) {
      console.log("not found");
    }
    let cartqty = cartforupdate[0].qty;
    console.log("Qty------", cartqty);
    if (cartqty === 1) {
      console.log("delete");
      const carts = await Carts.findOneAndDelete({
        _id: req.params.id,
        // owner: req.user._id,
      });
      if (!carts) {
        res.status(404).send();
      }
      res.send(carts);
      res.sendStatus(200);
    } else {
      console.log("update");
      let newqty = cartqty - 1;
      console.log("new qty", newqty);
      const filter = { _id: req.params.id };
      const update = { qty: newqty };
      const updateqty = await Carts.findOneAndUpdate(filter, update);
      await updateqty.save();
      res.send(`updated---${updateqty}`).status(200);
    }
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = cartRouter;
