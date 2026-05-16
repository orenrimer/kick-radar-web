const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, minlength: 6 },
  googleId: { type: String, sparse: true, unique: true },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  image: { type: String, required: true },
  hostedEvents: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Event' }],
  participatedEvents: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Event' }],
  requestedEvents: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Event' }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
