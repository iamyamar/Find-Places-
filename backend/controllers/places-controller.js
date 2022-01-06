const HttpError = require("../middlewere/http-error");
const { validationResult } = require("express-validator");
const { getCoordsForAddress } = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");
const mongooseUniqueValidator = require("mongoose-unique-validator");
const mongoose = require("mongoose");

//! TO Get Place by Place Id
exports.getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place",
      500
    );
    return next(error);
  }
  if (!place) {
    const error = new HttpError(
      "Could not find place for the provided Id",
      404
    );
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) });
};

//! TO Get Places by User Id
exports.getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later",
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided  User Id"),
      404
    );
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

// //! To Post new Place
exports.createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid Input Passed , PLease Check your Data", 422)
    );
  }

  const { title, description, address, creator } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (err) {
    return next(err);
  }
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/09/India_Gate_in_New_Delhi_03-2016.jpg",
    creator,
  });

  let user;
  try {
    user = User.findById(creator);
  } catch (err) {
    const error = new HttpError("Creating place failed, please try again", 500);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided Id", 404);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creitng place Failed Please try again", 500);
    return next(error);
  }
  res.status(201).json({ place: createdPlace });
};

// //! Update a Place by id
exports.updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid Input Passed , PLease Check your Data", 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place",
      500
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place",
      500
    );
    return next(error);
  }
  res.status(200).josn({ place: place.toObject({ getters: true }) });
};

// //! Delete a Place by id
exports.deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went Wrong coud not Delete Place",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("could not find place for this id", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went Wrong coud not Delete Place",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Place Deleted Succesfully!!" });
};
