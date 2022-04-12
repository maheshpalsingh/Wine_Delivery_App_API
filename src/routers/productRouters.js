const express = require("express");
const app = express();
const productRouter = express.Router();
const auth = require("../middleware/auth");
const Products = require("../models/product");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: "./uploads/images",
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${file.originalname}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Invalid extensions"));
    }
    cb(undefined, true);
  },
});

//registerproduct
productRouter.post(
  "/products/add",
  auth,
  upload.single("profile"),
  async (req, res) => {
    const image = `http://10.0.2.2:3001/profile/${req.file.filename}`;
    const data = req.body;
    const products = new Products({
      name: data.name,
      owner: req.user._id,
      price: data.price,
      category: data.category,
      description: data.description,
      company: data.company,
      image,
    });
    try {
      await products.save();
      res.status(201).send({ products });
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

//get my products
productRouter.get("/products/my", auth, async (req, res) => {
  try {
    const products = await Products.find({ owner: req.user._id })
      .sort({
        createdAt: -1,
      })
      .limit(2);
    res.send(products);
  } catch (e) {
    res.status(500).send(e);
  }
});

//getallproducts
productRouter.get("/products/all", async (req, res) => {
  try {
    const products = await Products.find();
    // .sort({
    //   createdAt: -1,
    // })
    // .limit(5);
    res.send(products);
  } catch (e) {
    res.status(500).send(e);
  }
});

//getproductsbycategory
productRouter.get("/products/category/:cat", async (req, res) => {
  try {
    const products = await Products.find({ company: req.params.cat });
    if (!products) {
      return res.status(404).send("No data");
    }
    res.send(products);
  } catch (error) {
    res.status(404).send(error);
  }
});

//updatemyproducts
productRouter.patch(
  "/products/me/:id",
  auth,
  upload.single("image"),
  async (req, res) => {
    const allowedupdates = [
      "name",
      "company",
      "price",
      "description",
      "category",
      "image",
    ];

    const updates = Object.keys({ ...req.body, image: req.file.filename });
    const isvalidupdate = updates.every((update) =>
      allowedupdates.includes(update)
    );

    if (!isvalidupdate) {
      return res.status(404).send({ error: "invalid updates" });
    }

    try {
      const products = await Products.findOne({
        _id: req.params.id,
        owner: req.user._id,
      });

      if (!products) {
        return res.status(404).send();
      }
      updates.forEach((update) => {
        products[update] = req.body[update];
        //products[update.image] = image;
      });
      await products.save();
      res.send(products);
    } catch (error) {
      res.status(400).send(error);
    }
  }
);

//deletemyproducts
productRouter.delete("/products/delete/my/:id", auth, async (req, res) => {
  try {
    const products = await Products.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!products) {
      res.status(404).send();
    }
    res.send(products);
    // res.sendStatus(200)
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = productRouter;
