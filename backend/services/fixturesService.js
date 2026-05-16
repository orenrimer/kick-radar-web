const axios = require('axios');

const HttpError = require('../models/http-error');

const FIXTURES_URL = 'https://v3.football.api-sports.io/fixtures';
const FIXTURE_HOST = 'v3.football.api-sports.io';
const ACTIVE_STATUS = 'NS-1H-HT-2H-ET-P';
const DEFAULT_TIMEZONE = 'Asia/Jerusalem';

const mapFixture = (event) => ({
  homeTeamName: event.teams.home.name,
  awayTeamName: event.teams.away.name,
  homeTeamLogo: event.teams.home.logo,
  awayTeamLogo: event.teams.away.logo,
  league: event.league.name,
  startTime: event.fixture.date,
  isLive: event.fixture.status.short !== 'NS',
  currMinute: event.fixture.status.elapsed,
  score: event.goals,
});

const findFixturesByDate = async (date) => {
  const apiKey = process.env.FOOTBALL_API_KEY;
  if (!apiKey) {
    throw new HttpError('Football API is not configured on the server.', 500);
  }

  try {
    const { data } = await axios.get(FIXTURES_URL, {
      params: { date, status: ACTIVE_STATUS, timezone: DEFAULT_TIMEZONE },
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': FIXTURE_HOST,
      },
    });
    return (data.response || []).map(mapFixture);
  } catch (err) {
    throw new HttpError('Failed to fetch fixtures.', 502);
  }
};

module.exports = { findFixturesByDate };
