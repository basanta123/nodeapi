const User = require("../models/user");
const lodash = require("lodash");
exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found"
      });
    }

    req.profile = user;
    //add profile object in req with user info
    next();
  });
};

exports.hasAuthorization = (req, res, next) => {
  const authorized =
    req.profile && req.auth && req.profile._id === req.auth._id;
  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorized to perform this action"
    });
  }
};

exports.allUsers = (req, res) => {
  User.find((error, users) => {
    if (error) return res.status(400).json({ error });
    return res.json({ users });
  }).select("name email created updated");
};

exports.getUser = (req, res) => {
  const { id, name, email, created, updated } = req.profile;
  return res.json({ user: { name, email, created, updated } });
};

exports.updateUser = async (req, res) => {
  let user = req.profile;
  // console.log({ user });
  const userExists = await User.findOne({
    email: req.body.email,
    _id: { $ne: user._id }
  });

  if (userExists)
    return res.status(403).json({
      errors: {
        email: "Email is taken !!!"
      }
    });

  let userToUpdate = {
    name: req.body.name,
    email: req.body.email,
    updated: Date.now()
  };
  user = lodash.extend(user, userToUpdate); //.extend mutate the user object based on req.body value

  user.save(err => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    const { name, email, created, updated } = user;
    return res.json({ user: { name, email, created, updated } });
  });
};

exports.deleteUser = (req, res) => {
  let user = req.profile;
  user.remove((error, user) => {
    if (error) {
      return res.status(400).json({
        error
      });
    }
    const { name, email, created, updated } = user;
    return res.json({ user: { name, email, created, updated } });
  });
};
