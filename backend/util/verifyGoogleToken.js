const { OAuth2Client } = require('google-auth-library');
const HttpError = require('../models/http-error');

const getClient = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new HttpError('Google Sign-In is not configured on the server.', 500);
  }
  return new OAuth2Client(clientId);
};

/**
 * Verifies a Google ID token from the GIS credential callback.
 * @returns {{ googleId: string, email: string, name: string, picture?: string }}
 */
const verifyGoogleIdToken = async (credential) => {
  if (!credential) {
    throw new HttpError('Google credential is required.', 422);
  }

  try {
    const client = getClient();
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      throw new HttpError('Google account did not provide an email address.', 422);
    }

    if (!payload.email_verified) {
      throw new HttpError('Google email address is not verified.', 422);
    }

    return {
      googleId: payload.sub,
      email: payload.email.toLowerCase(),
      name: payload.name || payload.email.split('@')[0],
      picture: payload.picture,
    };
  } catch (err) {
    if (err instanceof HttpError) {
      throw err;
    }
    throw new HttpError('Invalid or expired Google sign-in. Please try again.', 401);
  }
};

module.exports = { verifyGoogleIdToken };
