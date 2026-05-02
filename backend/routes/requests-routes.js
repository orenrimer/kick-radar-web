const express = require('express');
const requestsController = require('../controllers/requests-controllers');
const checkAuth = require('../middleware/check-auth');



module.exports = (broadcastNotification) => {
    const router = express.Router();

    // Fetch requests for a host
    router.get("/user/:uid", requestsController.getRequestForHost);

    router.use(checkAuth);

    // Send a request
    router.post("/send", async (req, res, next) => {
        try {
            await requestsController.sendRequest(req, res, next, broadcastNotification);
        } catch (err) {
            next(err);
        }
    });

    // Accept or decline a request
    router.patch("/:rid", async (req, res, next) => {
        try {
            await requestsController.updateRequestStatus(req, res, next, broadcastNotification);
        } catch (err) {
            next(err);
        }
    });

    // Cancel a request
    router.delete("/:eid/:uid", async (req, res, next) => {
        try {
            await requestsController.cancelRequest(req, res, next, broadcastNotification);
        } catch (err) {
            next(err);
        }
    });

    return router;
};
















// const express = require('express');

// const requestsController = require('../controllers/requests-controllers');
// const checkAuth = require('../middleware/check-auth');

// const router = express.Router();

// // Fetch requests for a host
// router.get("/user/:uid", requestsController.getRequestForHost);

// router.use(checkAuth);

// // Send a request
// router.post("/send", async (req, res, next) => {
//     try {
//         await requestsController.sendRequest(req, res, next);

//         // Send the notification after the response has been sent
//         const notification = {
//             type: 'new-request',
//             requesterId: req.body.requesterId,
//             eventId: req.body.eventId,
//         };
//         broadcastNotification(notification);
//     } catch (err) {
//         next(err); // Forward any errors to the error-handling middleware
//     }
// });



// // router.post("/send", requestsController.sendRequest);



// // Accept or decline a request
// router.patch("/:rid", requestsController.updateRequestStatus);

// router.delete("/:eid/:uid", requestsController.cancelRequest);

// module.exports = router;
