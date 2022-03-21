const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoder = jwt.verify(token, "thisismyapi");
    const user = await User.findOne({
      _id: decoder._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    //console.log("get token:", token);
    next();
  } catch (e) {
    res.status(401).send({ error: "plz authenticate..." });
  }
};

module.exports = auth;
