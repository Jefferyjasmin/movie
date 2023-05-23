const express = require("express");
const router = express.Router();
const {
  registerUser,
  getMe,
  loginUser,
  friendRequest,
  friendadded,
  remove_friend_request,
} = require("../controller/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.post("/req/:id", protect, friendRequest);
router.post("/added/:id", protect, friendadded);
router.post("/remove_friend/:id", protect, remove_friend_request);

module.exports = router;
