const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const userService = require('../services/userService');

const getUser = async (req, res, next) => {
  try {
    const user = await userService.findUserById(req.params.uid);
    res.status(200).json({ user });
  } catch (err) {
    next(err instanceof HttpError ? err : new HttpError(err.message, 500));
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.findAllUsers();
    res.json({ users });
  } catch (err) {
    next(err instanceof HttpError ? err : new HttpError(err.message, 500));
  }
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  try {
    const result = await userService.signup(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err instanceof HttpError ? err : new HttpError(err.message, 500));
  }
};

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);
    res.json(result);
  } catch (err) {
    next(err instanceof HttpError ? err : new HttpError(err.message, 500));
  }
};

const googleLogin = async (req, res, next) => {
  try {
    const result = await userService.loginWithGoogle(req.body);
    res.json(result);
  } catch (err) {
    next(err instanceof HttpError ? err : new HttpError(err.message, 500));
  }
};

const updateUser = async (req, res, next) => {
  if (req.params.uid !== req.userData.userId) {
    return next(new HttpError('You are not allowed to edit this user.', 401));
  }

  try {
    const user = await userService.updateUser({
      userId: req.params.uid,
      eventId: req.body.eventId,
      imageKey: req.file?.key,
    });
    res.status(200).json({ user });
  } catch (err) {
    next(err instanceof HttpError ? err : new HttpError(err.message, 500));
  }
};

exports.getUser = getUser;
exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;
exports.googleLogin = googleLogin;
exports.updateUser = updateUser;
