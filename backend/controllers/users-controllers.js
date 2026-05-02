const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const User = require('../models/user');
const Event = require('../models/event');

const getUser = async (req, res, next) => {
  let user;

  try {
    user = await User.findById(req.params.uid);
  } catch (err) {
    const error = new HttpError(
      'Could not find user for provided id, please try again.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404);
    return next(error);
  }

  res.status(200).json({ user });
};

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      'Could not create user, please try again.',
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    image: "avatar.jpg",
    hostedEvents: [],
    participatedEvents: [],
    requestedEvents: []
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      err,
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token
  });
};


const updateUser = async (req, res, next) => {
  let user;

  try {
    user = await User.findById(req.params.uid);
  } catch (err) {
    const error = new HttpError(
      'Could not find user for provided id, please try again.',
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404);
    return next(error);
  }

  if (user._id.toString() !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to edit this user.',
      401
    );
    return next(error);
  }

  let event;
  if (req.body.eventId) {
    try {
      event = await Event.findById(req.body.eventId);
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, please try again.',
        500
      );
      return next(error);
    }

    if (!event) {
      const error = new HttpError('Can not find an event.', 404);
      return next(error);
    }
  }

  if (req.file)
    user.image = req.file.key;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    if (event) {
      user.participatedEvents.pull(event);
      event.participants.pull(user)
      event.numOfParticipants -= 1;
      await event.save({ session: sess })
    }

    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update user.',
      500
    );
    return next(error);
  }

  res.status(200).json({ user: user.toObject({ getters: true }) });
}



exports.getUser = getUser;
exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;
exports.updateUser = updateUser;