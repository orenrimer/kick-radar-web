const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const getAddressFromCoords = require('../util/location');
const Event = require('../models/event');
const User = require('../models/user');
const Request = require('../models/request');

const findAllEvents = async () => {
  const events = await Event.find();
  if (!events.length) {
    return [];
  }
  return events.map((event) => event.toObject({ getters: true }));
};

const findEventById = async (eventId) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new HttpError('Could not find an event for the provided id.', 404);
  }
  return event.toObject({ getters: true });
};

const findEventsByUserId = async (userId) => {
  const user = await User.findById(userId)
    .populate('hostedEvents')
    .populate('participatedEvents')
    .populate('requestedEvents');

  if (!user) {
    throw new HttpError(
      'Could not find any events associated with the provided user id.',
      404
    );
  }

  const mapEvents = (events) =>
    events.map((event) => event.toObject({ getters: true }));

  return {
    hostedEvents: mapEvents(user.hostedEvents),
    participatedEvents: mapEvents(user.participatedEvents),
    requestedEvents: mapEvents(user.requestedEvents),
  };
};

const createEvent = async ({ title, description, coordinates, startTime, hostId }) => {
  const address = await getAddressFromCoords(coordinates);

  const createdEvent = new Event({
    title,
    description,
    address,
    coordinates,
    numOfParticipants: 1,
    host: hostId,
    startTime,
    participants: [hostId],
    pending: [],
  });

  const user = await User.findById(hostId);
  if (!user) {
    throw new HttpError('Could not find user for the provided host.', 404);
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await createdEvent.save({ session });
    user.hostedEvents.push(createdEvent);
    await user.save({ session });
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw new HttpError(
      err.message || 'Could not create event, please try again.',
      500
    );
  } finally {
    session.endSession();
  }

  return createdEvent.toObject({ getters: true });
};

const deleteEvent = async (eventId, userId) => {
  const event = await Event.findById(eventId).populate('participants');
  if (!event) {
    throw new HttpError('Could not find event for given id.', 404);
  }

  if (event.host.toString() !== userId) {
    throw new HttpError(
      'Unauthorized, only event host is allowed to delete event.',
      401
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await Request.deleteMany({ eventId }).session(session);

    const participantIds = [
      ...event.participants.map((p) => p._id.toString()),
      ...event.pending.map((p) => p._id.toString()),
    ];
    const uniqueIds = [...new Set(participantIds)];

    await Promise.all(
      uniqueIds.map(async (id) => {
        const participant = await User.findById(id).session(session);
        if (!participant) return;

        if (id === event.host.toString()) {
          participant.hostedEvents.pull(event._id);
        }
        participant.participatedEvents.pull(event._id);
        participant.requestedEvents.pull(event._id);
        await participant.save({ session });
      })
    );

    await Event.deleteOne({ _id: eventId }).session(session);
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw new HttpError(
      err.message || 'Something went wrong, please try again.',
      500
    );
  } finally {
    session.endSession();
  }
};

module.exports = {
  findAllEvents,
  findEventById,
  findEventsByUserId,
  createEvent,
  deleteEvent,
};
