const { describe, it } = require('node:test');
const assert = require('node:assert');
const HttpError = require('../models/http-error');
const { verifyGoogleIdToken } = require('../util/verifyGoogleToken');

describe('verifyGoogleIdToken', () => {
  it('rejects missing credential', async () => {
    await assert.rejects(
      () => verifyGoogleIdToken(''),
      (err) => err instanceof HttpError && err.code === 422
    );
  });
});
