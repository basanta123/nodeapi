const validator = require("validator");
const lodash = require("lodash");
exports.createPostValidator = (req, res, next) => {
  let errors = {};
  const rules = {
    title: !req.body.title
      ? "Title required"
      : validator.isEmpty(req.body.title)
      ? "Title required"
      : !validator.isLength(req.body.title, { min: 4, max: 150 })
      ? "Title should be between 4 to 150 characters"
      : "",

    body: !req.body.body
      ? "Body Required"
      : validator.isEmpty(req.body.body)
      ? "Body Required"
      : !validator.isLength(req.body.body, { min: 4, max: 2000 })
      ? "Body should be between 4 to 2000 characters"
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
