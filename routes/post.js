const express = require("express");
const {
  getPosts,
  createPost,
  postsByUser,
  postById,
  isPoster,
  deletePost,
  updatePost
} = require("../controllers/post");
const { requireSignin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const router = express.Router();
const { createPostValidator } = require("../validator/post");
router.get("/posts", requireSignin, getPosts);
router.get("/my-post", requireSignin, postsByUser);
router.post("/post", requireSignin, createPostValidator, createPost);
router.delete("/post/:postId", requireSignin, isPoster, deletePost);
router.put("/post/:postId", requireSignin, isPoster, updatePost);
//Any route containing userId our app will first execute userById
router.param("userId", userById);
//Any route containing postId our app will first execute postById
router.param("postId", postById);
module.exports = router;
