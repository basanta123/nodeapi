const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const dotenv = require("dotenv");
dotenv.config();
exports.signup = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists)
    return res.status(403).json({
      errors: {
        email: "Email is taken !!!"
      }
    });

  const user = await new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  await user.save();

  return res.json({
    message: "Sign up success !!! Please Login"
  });
};

exports.signin = (req, res) => {
  //find the user based on email
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user)
      return res
        .status(401)
        .json({ error: "User with that email doesnot exist." });

    if (!user.authenticate(password)) {
      return res.status(401).json({ error: "Email and Password do not match" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_TOKEN_EXPIRY
    });

    // const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res.cookie("t", token, {
      expire: new Date() + process.env.JWT_TOKEN_EXPIRY
    });

    const { _id, name, email } = user;
    return res.json({
      token,
      user: { _id, name, email }
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  return res.json({
    message: "Signed out successfully"
  });
};

exports.requireSignin = expressJwt({
  //if the token is VALID EXPRESS JWT APPENDS THE VERIFIED USERS ID IN AN AUTH KEY TO THE REQUEST OBJECT
  secret: process.env.JWT_SECRET,
  userProperty: "auth"
});
