const express = require('express');

const fixturesControllers = require('../controllers/fixtures-controllers');

const router = express.Router();

router.get('/', fixturesControllers.getFixturesByDate);

module.exports = router;
