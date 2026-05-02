const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getAddressFromCoords = require('../util/location');
const Event = require('../models/event');
const User = require('../models/user');
const Request = require('../models/request')

const getAllEvents = async (req, res, next) => {
    let events;

    try {
        events = await Event.find();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong.',
            500
        );
        return next(error);
    }

    if (!events) {
        const error = new HttpError(
            'Could not find any events.',
            404
        );
        return next(error);
    }

    res.json({
        events: events.map(event =>
            event.toObject({ getters: true })
        )
    });
}

const getEventById = async (req, res, next) => {
    const eventId = req.params.eid;
    let event;
    try {
        event = await Event.findById(eventId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong.', 500
        );
        return next(error);
    }

    if (!event) {
        const error = new HttpError(
            'Could not find an event for the provided id.',
            404
        );
        return next(error);
    }

    res.json({ event: event.toObject({ getters: true }) });
};

const getEventsByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let user;
    try {
        user = await User.findById(userId).populate('hostedEvents || participatedEvents || requestedEvents');
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, please try again.',
            500
        );
        return next(error);
    }

    if (!user) {
        return next(
            new HttpError('Could not find any events associated with the provided user id.', 404)
        );
    }

    res.json({
        hostedEvents: user.hostedEvents.map(event =>
            event.toObject({ getters: true }
            )),
        participatedEvents: user.participatedEvents.map(event =>
            event.toObject({ getters: true }
            )),
        requestedEvents: user.requestedEvents.map(event =>
            event.toObject({ getters: true }
            ))
    });
};

const createEvent = async (req, res, next) => {
    const { title, description } = req.body;

    const coordinates = {
        lat: parseFloat(JSON.parse(req.body.coordinates).lat),
        lng: parseFloat(JSON.parse(req.body.coordinates).lng)

    }
    let address;
    try {
        address = await getAddressFromCoords(coordinates);
    } catch (error) {
        return next(error);
    }

    const createdEvent = new Event({
        title,
        description,
        address: address,
        coordinates: coordinates,
        numOfParticipants: 1,
        host: req.userData.userId,
        startTime: req.body.startTime,
        participants: [req.userData.userId],
        pending: []
    });


    let user;

    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError('Internal error, please try again.', 500);
        return next(error);
    }

    if (!user) {
        const error = new HttpError('Could not find user for the provided host.', 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdEvent.save({ session: sess });
        user.hostedEvents.push(createdEvent);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }

    res.status(201).json({ event: createdEvent });
};

// const updatePlace = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return next(
//             new HttpError('Invalid inputs passed, please check your data.', 422)
//         );
//     }
//     const { title, description, likes, likedBy } = req.body;
//     const placeId = req.params.pid;

//     let place;
//     try {
//         place = await Place.findById(placeId);
//     } catch (err) {
//         const error = new HttpError(
//             'Something went wrong, could not update place.',
//             500
//         );
//         return next(error);
//     }

//     if ((title !== place.title || description !== place.description) && place.creator.toString() !== req.userData.userId) {
//         const error = new HttpError(
//             'You are not allowed to edit this place.',
//             401
//         );
//         return next(error);
//     }

//     place.title = title;
//     place.description = description;
//     place.likes = likes;
//     place.likedBy = likedBy;

//     try {
//         await place.save();
//     } catch (err) {
//         const error = new HttpError(
//             'Something went wrong, could not update place.',
//             500
//         );
//         return next(error);
//     }

//     res.status(200).json({ place: place.toObject({ getters: true }) });
// };

const deleteEvent = async (req, res, next) => {
    const eventId = req.params.eid;

    let event;
    try {
        event = await Event.findById(eventId).populate('participants');
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, please try again.',
            500
        );
        return next(error);
    }

    if (!event) {
        const error = new HttpError('Could not find event for given id.', 404);
        return next(error);
    }

    if (event.host.toString() !== req.userData.userId) {
        const error = new HttpError('Unauthorized, only event host is allowed to delete event.',
            401
        );
        return next(error);
    }


    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();

        await Request.deleteMany({ eventId: req.params.eid });

        await event.remove({ session: sess });

        event.participants.forEach(async (participant) => {
            if (participant._id.toString() === event.host.toString()) {
                participant.hostedEvents.pull(event);
            }
            participant.participatedEvents.pull(event);
            await participant.save({ session: sess });
        })

        event.pending.forEach(async (participant) => {
            participant.requestedEvents.pull(event);
            await participant.save({ session: sess });
        })

        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, please try again.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Deleted event.' });
};

exports.getAllEvents = getAllEvents;
exports.getEventById = getEventById;
exports.getEventsByUserId = getEventsByUserId;
exports.createEvent = createEvent;
// exports.updatePlace = updatePlace;
exports.deleteEvent = deleteEvent;
