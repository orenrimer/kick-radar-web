const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  // GeoJSON Point: `coordinates: [lng, lat]`. The 2dsphere index below
  // enables $near / $nearSphere / $geoWithin queries in O(log n).
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  startTime: { type: Date, required: true },
  numOfParticipants: { type: Number, required: true },
  capacity: { type: Number, default: 22 },
  host: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  participants: [{ type: mongoose.Types.ObjectId, required: true, ref: 'User' }],
  pending: [{ type: mongoose.Types.ObjectId, required: true, ref: 'User' }],
});

eventSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Event', eventSchema);
