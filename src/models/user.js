const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Products = require("./product");
const Carts = require("./cart");
// const Topic = require("./topics");
// const Article = require("./article");
const Address = require("./address");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("email format is wrong");
        }
      },
    },
    age: {
      required: true,
      type: Number,
      validate(value) {
        if (value < 18) {
          throw new Error("age should be greater than 17");
        }
      },
    },
    contactno: {
      required: true,
      type: Number,
      validate(value) {
        if (value < 10) {
          throw new Error("number should be greater than 10");
        }
      },
    },
    password: {
      required: true,
      type: String,
      trim: true,
      minlength: 6,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("password can not be set as password..");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.virtual("products", {
  ref: "Products",
  localField: "_id",
  foreignField: "owner",
});

userSchema.virtual("carts", {
  ref: "Carts",
  localField: "_id",
  foreignField: "owner",
});

userSchema.virtual("orders", {
  ref: "Orders",
  localField: "_id",
  foreignField: "owner",
});

userSchema.virtual("addresses", {
  ref: "Address",
  localField: "_id",
  foreignField: "owner",
});
userSchema.methods.toJSON = function () {
  const user = this;
  const newuser = user.toObject();
  delete newuser.password;
  delete newuser.tokens;
  return newuser;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "thisismyapi", {
    expiresIn: "30 days",
  });
  // console.log(token);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findbycredentials = async (email, password) => {
  console.log("4");
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("invalid login");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("invalid login");
  }
  console.log("5");
  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.pre("remove", async function (next) {
  const user = this;
  await Products.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
