const HttpError = require('../models/http-error');
const fixturesService = require('../services/fixturesService');

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const getFixturesByDate = async (req, res, next) => {
  const { date } = req.query;
  if (!date || !ISO_DATE.test(date)) {
    return next(new HttpError('Query param "date" (YYYY-MM-DD) is required.', 400));
  }

  try {
    const fixtures = await fixturesService.findFixturesByDate(date);
    res.json({ fixtures });
  } catch (err) {
    next(err instanceof HttpError ? err : new HttpError(err.message, 500));
  }
};

module.exports = { getFixturesByDate };
