const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Request = require('../models/request');
const Event = require('../models/event');
const User = require('../models/user');

const findPendingForHost = async (hostId) =>
  Request.find({ hostId, status: 'pending' }).populate('eventId requesterId');

const sendJoinRequest = async ({ eventId, requesterId, hostId }) => {
  if (requesterId === hostId) {
    throw new HttpError("You can't send request to yourself.", 400);
  }

  const existingRequest = await Request.findOne({ eventId, requesterId }).sort({
    _id: -1,
  });

  if (
    existingRequest &&
    (existingRequest.status === 'pending' || existingRequest.status === 'accepted')
  ) {
    throw new HttpError('Request already exists.', 400);
  }

  const requestedEvent = await Event.findById(eventId);
  if (!requestedEvent) {
    throw new HttpError('Could not find event for the provided event id.', 404);
  }

  const requester = await User.findById(requesterId);
  if (!requester) {
    throw new HttpError('Could not find user for the provided requester.', 404);
  }

  const newRequest = new Request({ eventId, requesterId, hostId });

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await newRequest.save({ session });
    requester.requestedEvents.push(requestedEvent);
    await requester.save({ session });
    requestedEvent.pending.push(requester);
    await requestedEvent.save({ session });
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw new HttpError(err.message || 'Something went wrong, please try again.', 500);
  } finally {
    session.endSession();
  }

  return {
    request: newRequest.toObject({ getters: true }),
    notification: {
      type: 'new-request',
      hostId,
      requesterId,
      eventId,
      requestId: newRequest._id.toString(),
    },
  };
};

const updateRequestStatus = async ({ requestId, status, hostUserId }) => {
  const request = await Request.findById(requestId);
  if (!request) {
    throw new HttpError('Could not find event request for provided id.', 404);
  }

  if (request.hostId.toString() !== hostUserId) {
    throw new HttpError(
      'Unauthorized, only event host can update event request status.',
      401
    );
  }

  const requester = await User.findById(request.requesterId);
  if (!requester) {
    throw new HttpError('Could not find the requesting user', 404);
  }

  const event = await Event.findById(request.eventId);
  if (!event) {
    throw new HttpError('Could not find an event related to the event request', 404);
  }

  if (status === 'accepted') {
    if (event.participants.some((id) => id.toString() === request.requesterId.toString())) {
      throw new HttpError('Requester is already participating in this event.', 400);
    }

    if (event.numOfParticipants >= event.capacity) {
      throw new HttpError('Event is full.', 400);
    }
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    requester.requestedEvents.pull(event);
    event.pending.pull(requester);

    if (status === 'accepted') {
      event.participants.push(requester);
      event.numOfParticipants += 1;
      requester.participatedEvents.push(event);
    }

    await Request.deleteOne({ _id: requestId }).session(session);
    await event.save({ session });
    await requester.save({ session });
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw new HttpError(err.message || 'Something went wrong, please try again.', 500);
  } finally {
    session.endSession();
  }

  return {
    request,
    notification: {
      type: 'update-request',
      hostId: hostUserId,
      requestId,
      requesterId: requester._id.toString(),
      eventId: event._id.toString(),
    },
  };
};

const cancelRequest = async ({ eventId, requesterId }) => {
  const request = await Request.findOne({ eventId, requesterId });
  if (!request) {
    throw new HttpError('Could not find event request for provided id.', 404);
  }

  if (request.requesterId.toString() !== requesterId) {
    throw new HttpError('Unauthorized, only the requester can cancel request.', 401);
  }

  const requestedEvent = await Event.findById(request.eventId);
  if (!requestedEvent) {
    throw new HttpError('Could not find an event associated with this request.', 404);
  }

  const requester = await User.findById(request.requesterId);
  if (!requester) {
    throw new HttpError('Could not find the requesting user', 404);
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    requester.requestedEvents.pull(requestedEvent);
    await requester.save({ session });
    requestedEvent.pending.pull(requester);
    await requestedEvent.save({ session });
    await Request.deleteOne({ _id: request._id }).session(session);
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw new HttpError(err.message || 'Something went wrong, please try again.', 500);
  } finally {
    session.endSession();
  }

  return {
    notification: {
      type: 'cancel-request',
      requesterId,
      eventId,
      requestId: request._id,
    },
  };
};

module.exports = {
  findPendingForHost,
  sendJoinRequest,
  updateRequestStatus,
  cancelRequest,
};
