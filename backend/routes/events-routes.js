const express = require('express');
const { check } = require('express-validator');

const eventsControllers = require('../controllers/events-controllers');
const checkAuth = require('../middleware/check-auth');
let multer = require('multer');
let upload = multer();

const router = express.Router();

router.get('/', eventsControllers.getAllEvents);

router.get('/:eid', eventsControllers.getEventById);

router.get('/user/:uid', eventsControllers.getEventsByUserId);

router.use(checkAuth);

router.post(
    '/',
    [
        check('title')
            .not()
            .isEmpty(),
        check('description')
            .not()
            .isEmpty(),
    ],
    upload.fields([]),
    eventsControllers.createEvent
);

// router.patch(
//     '/:pid',
//     [
//         check('title')
//             .not()
//             .isEmpty(),
//         check('description').isLength({ max: 50 })
//     ],
//     placesControllers.updatePlace
// );

router.delete('/:eid', eventsControllers.deleteEvent);

module.exports = router;
