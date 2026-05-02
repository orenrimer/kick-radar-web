const axios = require('axios');

const HttpError = require('../models/http-error');


const API_KEY = process.env.GOOGLE_API_KEY;

async function getAddressFromCoords({ lat, lng }) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_API_KEY}`
  );

  const data = response.data;

  if (!response || !data) {
    const error = new HttpError(
      'Could not find location for the given address.',
      404
    );
    throw error;
  }

  const address = data.results[0].formatted_address;
  return address;
}


module.exports = getAddressFromCoords;
