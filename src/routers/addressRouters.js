const express = require("express");
const app = express();
const addressRouter = express.Router();
const auth = require("../middleware/auth");
const Address = require("../models/address");

addressRouter.post("/user/add/address", auth, async (req, res) => {
  let data = req.body;
  let userid = req.user._id;

  if (!data) {
    return res.send("Plz add Address").status(400);
  }
  try {
    const newaddress = new Address({
      ...req.body,
      owner: userid,
    });
    console.log("Address:", newaddress);
    await newaddress.save();
    res.status(201).send(newaddress);
  } catch (e) {
    res.send(e).status(400);
  }
});

addressRouter.get("/user/getmy/addresses", auth, async (req, res) => {
  try {
    let myaddress = await Address.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    if (!myaddress) {
      return res.status(404).send("No Address, add some");
    }
    res.send(myaddress).status(200);
  } catch (e) {
    res.status(400).send(e);
  }
});

addressRouter.delete("/user/delete/myaddress/:id", auth, async (req, res) => {
  try {
    const editaddress = await Address.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!editaddress) {
      res.status(404).send();
    }
    res.send(products);
  } catch (e) {
    res.send(e).status(400);
  }
});
module.exports = addressRouter;
