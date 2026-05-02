const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Request = require('../models/request');
const Event = require('../models/event');
const User = require('../models/user');
const request = require('../models/request');


const sendRequest = async (req, res, next, broadcastNotification) => {
    const { eventId, requesterId, hostId } = req.body;

    if (requesterId === hostId) {
        return res.status(400).json({ message: "You can't send request to ypurself." });
    }

    let existingRequest;
    try {
        existingRequest = await Request.findOne({ eventId, requesterId }).sort({ _id: -1 });
    } catch (err) {
        const error = new HttpError('Something went wrong, please try again.', 500);
        return next(error);
    }

    if (existingRequest && (existingRequest.status === "pending" || existingRequest.status === "accepted")) {
        console.log('Request already exists.');
        const error = new HttpError('Request already exists.', 400);
        return next(error);
    }

    let requestedEvent;

    try {
        requestedEvent = await Event.findById(eventId);
    } catch (err) {
        const error = new HttpError('Something went wrong, please try again.', 500);
        return next(error);
    }

    if (!requestedEvent) {
        const error = new HttpError('Could not find event for the provided event id.', 404);
        return next(error);
    }


    let requester;

    try {
        requester = await User.findById(requesterId);
    } catch (err) {
        const error = new HttpError('Something went wrong, please try again.', 500);
        return next(error);
    }


    if (!requester) {
        const error = new HttpError('Could not find user for the provided requster.', 404);
        return next(error);
    }

    const newRequest = new Request({ eventId, requesterId, hostId });

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();

        await newRequest.save();

        requester.requestedEvents.push(requestedEvent);
        await requester.save({ session: sess });

        requestedEvent.pending.push(requester);
        await requestedEvent.save({ session: sess });

        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }

    broadcastNotification({
        type: 'new-request',
        hostId: req.body.hostId,
        requesterId: req.body.requesterId,
        eventId: req.body.eventId,
        requestId: newRequest._id.toString()
    });
    res.status(201).json({ request: newRequest.toObject({ getters: true }) });
}


const getRequestForHost = async (req, res, next) => {
    try {
        const requests = await Request.find({ hostId: req.params.uid, status: "pending" }).populate("eventId requesterId");;
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const updateRequestStatus = async (req, res, next, broadcastNotification) => {
    const { status } = req.body; // "accepted" or "declined"
    let request;

    try {
        request = await Request.findById(req.params.rid);
    } catch (err) {
        const error = new HttpError(
            'Somthing went wrong, please try again later.',
            500
        );
        return next(error);
    }

    if (!request) {
        const error = new HttpError('Could not find event request for provided id.', 404);
        return next(error);
    }


    if (request.hostId.toString() !== req.userData.userId) {
        const error = new HttpError(
            'Unauthorized, only event host can update event request status.',
            401
        );
        return next(error);
    }

    let requester;

    try {
        requester = await User.findById(request.requesterId);
    } catch (err) {
        const error = new HttpError(
            'Somthing went wrong, please try again later.',
            500
        );
        return next(error);
    }

    if (!requester) {
        const error = new HttpError('Could not find the requsting user', 404);
        return next(error);
    }

    let event;

    try {
        event = await Event.findById(request.eventId);
    } catch (err) {
        const error = new HttpError(
            'Somthing went wrong, please try again later.',
            500
        );
        return next(error);
    }

    if (!event) {
        const error = new HttpError('Could not find an event realted to the event request', 404);
        return next(error);
    }

    if (status === "accepted") {
        if (event.participants.includes(request.requesterId)) {
            const error = new HttpError('Requester is already participating this event.', 400);
            return next(error);
        }

        if (event.numOfParticipants >= event.capacity) {
            const error = new HttpError('Event is full.', 400);
            return next(error);
        }
    }


    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();

        requester.requestedEvents.pull(event);
        event.pending.pull(requester);

        if (status == "accepted") {
            event.participants.push(requester);
            event.numOfParticipants += 1;
            requester.participatedEvents.push(event);
        }

        await request.remove({ session: sess });
        await event.save({ session: sess });
        await requester.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {

        const error = new HttpError(err, 500);
        return next(error);
    }

    broadcastNotification({
        type: 'update-request',
        hostId: req.body.hostId,
        requestId: req.params.rid,
        requesterId: requester._id.toString(),
        eventId: event._id.toString()
    });
    res.status(201).json({ request });
}



const cancelRequest = async (req, res, next, broadcastNotification) => {
    let request;
    try {
        request = await Request.findOne({ eventId: req.params.eid, requesterId: req.params.uid });
    } catch (err) {
        const error = new HttpError(
            'Somthing went wrong, please try again later.',
            500
        );
        return next(error);
    }

    if (!request) {
        const error = new HttpError('Could not find event request for provided id.', 404);
        return next(error);
    }


    if (request.requesterId.toString() !== req.params.uid) {
        const error = new HttpError(
            'Unauthorized, only the requester can cancel request.',
            401
        );
        return next(error);
    }

    let requestedEvent;
    try {
        requestedEvent = await Event.findById(request.eventId);
    } catch (err) {
        const error = new HttpError(
            'Somthing went wrong, please try again later.',
            500
        );
        return next(error);
    }

    if (!requestedEvent) {
        const error = new HttpError('Could not find an event associated with this request.', 404);
        return next(error);
    }


    let requester;

    try {
        requester = await User.findById(request.requesterId);
    } catch (err) {
        const error = new HttpError(
            'Somthing went wrong, please try again later.',
            500
        );
        return next(error);
    }

    if (!requester) {
        const error = new HttpError('Could not find the requsting user', 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();


        requester.requestedEvents.pull(requestedEvent);
        await requester.save({ session: sess });

        requestedEvent.pending.pull(requester);
        await requestedEvent.save({ session: sess });
        console.log("dssadasdasdasdasdasdsads")

        await request.remove({ session: sess });

        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }

    broadcastNotification({
        type: 'cancel-request',
        requesterId: req.params.uid,
        eventId: req.params.eid,
        requestId: request._id
    });
    res.status(200).json({ message: 'Request deleted.' });
}


exports.sendRequest = sendRequest;
exports.getRequestForHost = getRequestForHost;
exports.updateRequestStatus = updateRequestStatus;
exports.cancelRequest = cancelRequest;