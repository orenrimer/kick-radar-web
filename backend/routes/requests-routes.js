const express = require('express');
const requestsController = require('../controllers/requests-controllers');
const checkAuth = require('../middleware/check-auth');

module.exports = (broadcastNotification) => {
  const router = express.Router();

  router.get('/user/:uid', requestsController.getRequestForHost);

  router.use(checkAuth);

  router.post('/send', (req, res, next) =>
    requestsController.sendRequest(req, res, next, broadcastNotification)
  );

  router.patch('/:rid', (req, res, next) =>
    requestsController.updateRequestStatus(req, res, next, broadcastNotification)
  );

  router.delete('/:eid/:uid', (req, res, next) =>
    requestsController.cancelRequest(req, res, next, broadcastNotification)
  );

  return router;
};
