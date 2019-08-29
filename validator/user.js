const validator = require("validator");
const lodash = require("lodash");
exports.userSignupValidator = (req, res, next) => {
  let errors = {};
  const rules = {
    name: !req.body.name
      ? "Name required"
      : validator.isEmpty(req.body.name)
      ? "Name required"
      : !validator.isLength(req.body.name, { min: 3, max: 100 })
      ? "Name should be between 3 to 100 characters"
      : "",

    email: !req.body.email
      ? "Email required"
      : validator.isEmpty(req.body.email)
      ? "Email required"
      : !validator.isEmail(req.body.email)
      ? "Email should be a valid email address"
      : "",

    password: !req.body.password
      ? "Password Required"
      : validator.isEmpty(req.body.password)
      ? "Password Required"
      : !validator.isLength(req.body.password, { min: 8, max: 20 })
      ? "Password  should be between 8 to 20 characters"
      : ""
  };

  for (let key in rules) {
    if (rules[key] != "") {
      errors[key] = rules[key];
    }
  }

  // if (Object.keys(errors).length) return res.status(422).json({ errors });
  if (!lodash.isEmpty(errors)) return res.status(422).json({ errors });

  next();
};

exports.userUpdateValidator = (req, res, next) => {
  let errors = {};
  const rules = {
    name: !req.body.name
      ? "Name required"
      : validator.isEmpty(req.body.name)
      ? "Name required"
      : !validator.isLength(req.body.name, { min: 3, max: 100 })
      ? "Name should be between 3 to 100 characters"
      : "",

    email: !req.body.email
      ? "Email required"
      : validator.isEmpty(req.body.email)
      ? "Email required"
      : !validator.isEmail(req.body.email)
      ? "Email should be a valid email address"
      : ""
  };

  for (let key in rules) {
    if (rules[key] != "") {
      errors[key] = rules[key];
    }
  }

  // if (Object.keys(errors).length) return res.status(422).json({ errors });
  if (!lodash.isEmpty(errors)) return res.status(422).json({ errors });

  next();
};
