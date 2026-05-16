const { describe, it } = require('node:test');
const assert = require('node:assert');
const HttpError = require('../models/http-error');

describe('HttpError', () => {
  it('sets message and status code', () => {
    const err = new HttpError('Not found', 404);
    assert.equal(err.message, 'Not found');
    assert.equal(err.code, 404);
  });
});
