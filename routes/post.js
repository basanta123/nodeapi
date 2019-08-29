const express = require("express");
const { getPosts, createPost } = require("../controllers/post");
const { requireSignin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const router = express.Router();
const { createPostValidator } = require("../validator/post");
router.get("/", requireSignin, getPosts);
router.post("/post", requireSignin, createPostValidator, createPost);
//Any route containing userId our app will first execute userById
router.param("userId", userById);
module.exports = router;
