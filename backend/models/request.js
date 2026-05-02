const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const requestSchema = new Schema({
    hostId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    requesterId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    eventId: { type: mongoose.Types.ObjectId, required: true, ref: 'Event' },
    status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
});

module.exports = mongoose.model('request', requestSchema);
