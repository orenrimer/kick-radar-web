const { describe, it, afterEach } = require('node:test');
const assert = require('node:assert');
const HttpError = require('../models/http-error');
const { findFixturesByDate } = require('../services/fixturesService');

const originalKey = process.env.FOOTBALL_API_KEY;

afterEach(() => {
  if (originalKey === undefined) {
    delete process.env.FOOTBALL_API_KEY;
  } else {
    process.env.FOOTBALL_API_KEY = originalKey;
  }
});

describe('findFixturesByDate', () => {
  it('throws when FOOTBALL_API_KEY is not configured', async () => {
    delete process.env.FOOTBALL_API_KEY;
    await assert.rejects(
      () => findFixturesByDate('2025-01-01'),
      (err) => err instanceof HttpError && err.code === 500
    );
  });
});
