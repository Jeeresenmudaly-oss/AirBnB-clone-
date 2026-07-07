const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');

// Small helper that turns express-validator errors into a
const checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(
      errors
        .array()
        .map((e) => e.msg)
        .join(', '),
    );
  }
};

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  checkValidation(req, res);

  const { username, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('An account with that email already exists');
  }

  const user = await User.create({
    username,
    email,
    password,
    role: role || 'user',
  });

  res.status(201).json({
    success: true,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user._id),
  });
});

// Log a user in
const loginUser = asyncHandler(async (req, res) => {
  checkValidation(req, res);

  const { email, password } = req.body;

  // password has select:false in the schema, so ask
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    success: true,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user._id),
  });
});

// Get the currently logged-in user's profile
const getMe = asyncHandler(async (req, res) => {
  // req.user is set by the protect middleware
  res.json({ success: true, user: req.user });
});

module.exports = { registerUser, loginUser, getMe };
