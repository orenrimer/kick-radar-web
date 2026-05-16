const HttpError = require('../models/http-error');
const requestService = require('../services/requestService');

const getRequestForHost = async (req, res, next) => {
  try {
    const requests = await requestService.findPendingForHost(req.params.uid);
    res.status(200).json(requests);
  } catch (err) {
    next(err instanceof HttpError ? err : new HttpError(err.message, 500));
  }
};

const sendRequest = async (req, res, next, broadcastNotification) => {
  try {
    const { request, notification } = await requestService.sendJoinRequest(req.body);
    broadcastNotification(notification);
    res.status(201).json({ request });
  } catch (err) {
    next(err instanceof HttpError ? err : new HttpError(err.message, 500));
  }
};

const updateRequestStatus = async (req, res, next, broadcastNotification) => {
  try {
    const { request, notification } = await requestService.updateRequestStatus({
      requestId: req.params.rid,
      status: req.body.status,
      hostUserId: req.userData.userId,
    });
    broadcastNotification(notification);
    res.status(201).json({ request });
  } catch (err) {
    next(err instanceof HttpError ? err : new HttpError(err.message, 500));
  }
};

const cancelRequest = async (req, res, next, broadcastNotification) => {
  try {
    const { notification } = await requestService.cancelRequest({
      eventId: req.params.eid,
      requesterId: req.params.uid,
    });
    broadcastNotification(notification);
    res.status(200).json({ message: 'Request deleted.' });
  } catch (err) {
    next(err instanceof HttpError ? err : new HttpError(err.message, 500));
  }
};

exports.getRequestForHost = getRequestForHost;
exports.sendRequest = sendRequest;
exports.updateRequestStatus = updateRequestStatus;
exports.cancelRequest = cancelRequest;
