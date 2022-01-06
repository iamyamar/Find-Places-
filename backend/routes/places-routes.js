const express = require("express");
const {
  getPlacesByUserId,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/places-controller");
const { check } = require("express-validator");
const router = express.Router();

router.get("/:pid", getPlaceById);

router.get("/user/:uid", getPlacesByUserId);

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  createPlace
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  updatePlace
);

router.delete("/:pid", deletePlace);

module.exports = router;
