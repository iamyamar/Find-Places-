const axios = require("axios");
const HttpError = require("../middlewere/http-error");

const API_KEY = "";

exports.getCoordsForAddress = async (address) => {
  return {
    lat: 40.7484474,
    lng: -73.9871516,
  };
  // const response = await axios.get(``);
  // const data = response.data;
  // if (!data || Data.status === "ZERO_RESULTS") {
  //   const erroe = new HttpError(
  //     "Counld nod find location for the given address",
  //     422
  //   );
  //   throw error;
  // }

  // const coordinates = data.results[0].geometry.location;
  // return coordinates;
};
