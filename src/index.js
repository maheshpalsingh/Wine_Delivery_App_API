const express = require("express");
require("./db/mongoose.js");
const app = express();
const port = process.env.PORT || 3001;

const user = require("./routers/userRouters");
const product = require("./routers/productRouters");
const cart = require("./routers/cartRouters");
const orders = require("./routers/orderRouters");
app.use(express.json());
app.use(user);
app.use(orders);
app.use(product);
app.use(cart);
app.use("/profile", express.static("uploads/images"));

app.listen(port, () => {
  console.log(`Server is up on ${port} port`);
});

// const multer = require("multer");
// const storage = multer.diskStorage({
//   destination: "./uploads/images",
//   filename: (req, file, cb) => {
//     return cb(null, `${file.fieldname}_${Date.now()}${file.originalname}`);
//   },
// });
// const upload = multer({
//   storage,
//   limits: { fileSize: 1000000 },
//   fileFilter: function (req, file, cb) {
//     if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//       return cb(new Error("Invalid extensions"));
//     }
//     cb(undefined, true);
//   },
// });
// app.use("/profile", express.static("uploads/images"));
// app.post("/upload", upload.single("profile"), (req, res) => {
//   res.json({
//     success: 1,
//     image: `http://localhost:3001/profile/${req.file.filename}`,
//   });
// });
