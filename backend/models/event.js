const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  startTime: { type: Date, required: true },
  numOfParticipants: { type: Number, required: true },
  capacity: { type: Number, default: 22 },
  host: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  participants: [{ type: mongoose.Types.ObjectId, required: true, ref: 'User' }],
  pending: [{ type: mongoose.Types.ObjectId, required: true, ref: 'User' }]
});

module.exports = mongoose.model('Event', eventSchema);
