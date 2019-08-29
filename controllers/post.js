const Post = require("../models/post");
exports.getPosts = (req, res) => {
  const posts = Post.find()
    .select("_id title body")
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
    body: req.body.body
  });

  post.save().then(post => {
    res.json({
      post
    });
  });
};
