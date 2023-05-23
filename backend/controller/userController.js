const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../Model/userModel");
const asyncHandler = require("express-async-handler");
const db = require("../config/db");

//@desc Register new users
//@route Post /api/users
//@access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  console.log("this is from frontend", req.body);
  if (!name || !email || !password) {
    return res.status(400).json({ message: "please complete all fields" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password

  const salt = await bcrypt.genSalt(10);
  const hashedPassowrd = await bcrypt.hash(password, salt);
  // create users
  const user = await User.create({
    name: name,
    email: email,
    password: hashedPassowrd,
  });
  console.log("user", user);
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//@desc Authenticate a users
//@route Post /api/users/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("this is req.body.password", password, typeof password);
  // find users by email
  const user = await User.findOne({ email });
  console.log("this is user", user);

  // check password

  if (user && (await bcrypt.compare(password, user.password))) {
    return res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      friends: user.friends,
      friendRequest: user.friendRequest,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Incorrect values Please re-enter User Name and password");
  }
});

//@desc Get user data
//@route Get /api/users/me
//@access Private
const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json(req.user);
});
// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const friendRequest = asyncHandler(async (req, res) => {
  const req_user = req.user._id;
  console.log("id comming in ", req_user);
  const user = await User.findOne({ req_user });
  if (!user)
    res
      .status(404)
      .send({ message: "you have to be logged in to like someones profile" });

  const requested_users_id = req.params.id;

  const requested_User = await User.findById(requested_users_id);
  if (!requested_User) res.status(404).send({ message: "NO USER FOUND" });

  const length = requested_User.friendRequest.filter(
    (request) => request.id == user._id
  ).length;
  if (length > 0) {
    res.status(200).send({ message: "you have already requested this user" });
  } else {
    requested_User.friendRequest.push(user);
    requested_User.save().then((arr) => res.json(arr));
  }
});

const friendadded = asyncHandler(async (req, res) => {
  const req_user = req.user._id;
  console.log("this is friended user", req_user);

  const user = await User.findById(req_user);

  console.log("this is user is ME", user);
  if (!user)
    res
      .status(404)
      .send({ message: "you have to be logged in to like someones profile" });

  const befriend_users_id = req.params.id;

  const befriend_User = await User.findById(befriend_users_id);
  console.log("this is user is the one who requested me ", befriend_User);
  if (!befriend_User) res.status(404).send({ message: "NO USER FOUND" });

  const length = user.friends.filter(
    (request) => request._id.toString() == befriend_User._id.toString()
  ).length;
  console.log(length);
  if (length > 0) {
    res.status(200).send({ message: "Already on friends list" });
  } else {
    user.friends.push(befriend_User);
    user.save().then((arr) => res.json(arr));
  }
});
const remove_friend_request = asyncHandler(async (req, res) => {
  const req_user = req.user._id;
  console.log("id comming in ", req_user);
  const user = await User.findById(req_user);
  console.log(user);
  if (!user)
    res
      .status(404)
      .send({ message: "you have to be logged in to like someones profile" });

  const friend_requested_id = req.params.id;
  console.log(user);
  const friend_requested = await User.findById(friend_requested_id);
  if (!friend_requested) res.status(404).send({ message: "NO USER FOUND" });
  const update = {
    $pull: {
      friendRequest: { _id: friend_requested._id },
    },
  };
  const filter = { _id: user._id };

  const options = { multi: true };
  console.log("db=>>>>>>>>>>>>>.", db.user("users"));
  // db.User("users").updateOne(filter, update, options, function (err, result) {
  //   if (err) throw err;
  //   console.log(result.modifiedCount + " document(s) updated");
  // });

  user.save().then((arr) => res.json(arr));
});
const remove_friend = asyncHandler(async (req, res) => {});
module.exports = {
  registerUser,
  loginUser,
  getMe,
  friendRequest,
  friendadded,
  remove_friend_request,
};
