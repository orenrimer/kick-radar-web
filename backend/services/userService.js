const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const User = require('../models/user');
const Event = require('../models/event');
const { verifyGoogleIdToken } = require('../util/verifyGoogleToken');

const signToken = (user) =>
  jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_KEY,
    { expiresIn: '1h' }
  );

const authResponse = (user) => ({
  userId: user.id,
  email: user.email,
  token: signToken(user),
});

const findUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new HttpError('Could not find user for provided id.', 404);
  }
  return user.toObject({ getters: true });
};

const findAllUsers = async () => {
  const users = await User.find({}, '-password');
  return users.map((user) => user.toObject({ getters: true }));
};

const signup = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    if (existingUser.googleId && !existingUser.password) {
      throw new HttpError(
        'An account with this email already exists. Please sign in with Google.',
        422
      );
    }
    throw new HttpError('User exists already, please login instead.', 422);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const createdUser = new User({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    authProvider: 'local',
    image: 'avatar.jpg',
    hostedEvents: [],
    participatedEvents: [],
    requestedEvents: [],
  });

  await createdUser.save();
  return authResponse(createdUser);
};

const login = async ({ email, password }) => {
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (!existingUser) {
    throw new HttpError('Invalid credentials, could not log you in.', 401);
  }

  if (!existingUser.password) {
    throw new HttpError(
      'This account uses Google Sign-In. Please use the Google button below.',
      401
    );
  }

  const isValidPassword = await bcrypt.compare(password, existingUser.password);
  if (!isValidPassword) {
    throw new HttpError('Invalid credentials, could not log you in.', 401);
  }

  return authResponse(existingUser);
};

/**
 * Verify Google id_token, find/link/create user, return app JWT.
 */
const loginWithGoogle = async ({ credential }) => {
  const { googleId, email, name, picture } = await verifyGoogleIdToken(credential);

  let user = await User.findOne({ googleId });

  if (!user) {
    user = await User.findOne({ email });

    if (user) {
      if (user.googleId && user.googleId !== googleId) {
        throw new HttpError(
          'This email is linked to a different Google account.',
          422
        );
      }
      user.googleId = googleId;
      if (picture && user.image === 'avatar.jpg') {
        user.image = picture;
      }
      await user.save();
    } else {
      user = new User({
        name,
        email,
        googleId,
        authProvider: 'google',
        image: picture || 'avatar.jpg',
        hostedEvents: [],
        participatedEvents: [],
        requestedEvents: [],
      });
      await user.save();
    }
  }

  return authResponse(user);
};

const updateUser = async ({ userId, eventId, imageKey }) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new HttpError('Could not find user for provided id.', 404);
  }

  let event;
  if (eventId) {
    event = await Event.findById(eventId);
    if (!event) {
      throw new HttpError('Can not find an event.', 404);
    }
  }

  if (imageKey) {
    user.image = imageKey;
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (event) {
      user.participatedEvents.pull(event);
      event.participants.pull(user);
      event.numOfParticipants = Math.max(0, event.numOfParticipants - 1);
      await event.save({ session });
    }
    await user.save({ session });
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw new HttpError(
      err.message || 'Something went wrong, could not update user.',
      500
    );
  } finally {
    session.endSession();
  }

  return user.toObject({ getters: true });
};

module.exports = {
  findUserById,
  findAllUsers,
  signup,
  login,
  loginWithGoogle,
  updateUser,
};
