const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const eventService = require('../services/eventService');

const getAllEvents = async (req, res, next) => {
  try {
    const events = await eventService.findAllEvents();
    res.json({ events });
  } catch (err) {
    next(err instanceof HttpError ? err : new HttpError(err.message, 500));
  }
};

const getEventById = async (req, res, next) => {
  try {
    const event = await eventService.findEventById(req.params.eid);
    res.json({ event });
  } catch (err) {
    next(err instanceof HttpError ? err : new HttpError(err.message, 500));
  }
};

const getEventsByUserId = async (req, res, next) => {
  try {
    const events = await eventService.findEventsByUserId(req.params.uid);
    res.json(events);
  } catch (err) {
    next(err instanceof HttpError ? err : new HttpError(err.message, 500));
  }
};

const createEvent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description } = req.body;
  const coordinates = {
    lat: parseFloat(JSON.parse(req.body.coordinates).lat),
    lng: parseFloat(JSON.parse(req.body.coordinates).lng),
  };

  try {
    const event = await eventService.createEvent({
      title,
      description,
      coordinates,
      startTime: req.body.startTime,
      hostId: req.userData.userId,
    });
    res.status(201).json({ event });
  } catch (err) {
    next(err instanceof HttpError ? err : new HttpError(err.message, 500));
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    await eventService.deleteEvent(req.params.eid, req.userData.userId);
    res.status(200).json({ message: 'Deleted event.' });
  } catch (err) {
    next(err instanceof HttpError ? err : new HttpError(err.message, 500));
  }
};

exports.getAllEvents = getAllEvents;
exports.getEventById = getEventById;
exports.getEventsByUserId = getEventsByUserId;
exports.createEvent = createEvent;
exports.deleteEvent = deleteEvent;
