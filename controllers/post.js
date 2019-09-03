const Post = require("../models/post");
const User = require("../models/user");
const lodash = require("lodash");
const formidable = require("formidable");
const fs = require("fs");
exports.getPosts = (req, res) => {
  const posts = Post.find()
    .select("_id title body photo")
    .populate("postedBy", "name email")
    .then(posts => {
      res.json({
        posts
      });
    })
    .catch(error => {
      errors: error;
    });
};

exports.createPost = (req, res) => {
  const post = new Post({
    title: req.body.title,
    body: req.body.body,
    postedBy: req.auth._id
  });

  post.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    User.findById(req.auth._id)
      .select("name email")
      .then(data => {
        const postedBy = data;
        const { title, body } = result;
        res.json({
          post: { title, body, postedBy }
        });
      })
      .catch(err => console.log(err.message));
  });
};

exports.postsByUser = (req, res) => {
  Post.find({ postedBy: req.auth._id })
    .select("title body photo created")
    .populate("postedBy", "name email")
    .sort({ created: "desc" })
    .exec((error, posts) => {
      if (error) {
        res.status(400).json({
          error: err
        });
      }
      res.json({
        posts
      });
    });
};

exports.postById = (req, res, next, id) => {
  Post.findById(id)
    .populate("postedBy", "name email")
    .exec((error, post) => {
      if (error) {
        res.status(400).json({
          error: error
        });
      }
      req.post = post;
      next();
    });
};

exports.isPoster = (req, res, next) => {
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;

  if (!isPoster) {
    return res.status(403).json({
      error: "User is not authorized"
    });
  }
  next();
};

exports.deletePost = (req, res) => {
  let post = req.post;
  console.log(post);
  post.remove((err, post) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    return res.json({
      message: "Post deleted successfully"
    });
  });
};

exports.updatePost = async (req, res) => {
  let post = req.post;

  let postToUpdate = {
    title: req.body.title,
    body: req.body.body
  };
  post = lodash.extend(post, postToUpdate); //.extend mutate the post object based on req.body value

  post.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    User.findById(req.auth._id)
      .select("name email")
      .then(data => {
        const postedBy = data;
        const { title, body } = result;
        res.json({
          post: { title, body, postedBy }
        });
      })
      .catch(err => console.log(err.message));
  });
};
