const express = require("express");

const {
  userById,
  allUsers,
  getUser,
  updateUser,
  deleteUser
} = require("../controllers/user");
const { requireSignin } = require("../controllers/auth");
const router = express.Router();
const { userUpdateValidator } = require("../validator/user");

router.get("/users", allUsers);
router.get("/user/:userId", requireSignin, getUser);
router.put("/user/:userId", requireSignin, userUpdateValidator, updateUser);
router.delete("/user/:userId", requireSignin, deleteUser);
//Any route containing userId our app will first execute userById
router.param("userId", userById);
module.exports = router;
