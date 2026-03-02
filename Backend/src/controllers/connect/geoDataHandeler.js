const User = require("../../models/user");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

async function handleGetNearbyUsers(req, res) {
  try {
    const { lat, lng, rangeKm = 10 } = req.query;

    const latitude = Number(lat);
    const longitude = Number(lng);
    const km = Number(rangeKm);

    if (Number.isNaN(latitude) || Number.isNaN(longitude) || Number.isNaN(km)) {
      return res
        .status(400)
        .json({ message: "lat, lng, rangeKm must be numbers" });
    }

    const radiusInRadians = km / 6378.1; // Earth radius in km

    const users = await User.find({
      _id: { $ne: req.user.id }, // optional: exclude logged-in user
      "location.coordinates": {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radiusInRadians],
        },
      },
    }).select("_id name username avatar location about");

    return res.status(200).json({ count: users.length, users });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleGetUserLocation(req, res) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("_id location").lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.location || !Object.keys(user.location).length) {
      return res.status(404).json({ message: "Location not set" });
    }

    return res.status(200).json({ location: user.location });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleSetUserGeodata(req, res) {
  try {
    const userId = req.user?.id;
    const input = req.body?.location ?? req.body ?? {};

    const {
      city,
      state,
      county,
      placeName,
      coordinates: rawCoordinates,
    } = input;

    const setPayload = {};

    // Helper to safely trim strings
    const trimIfString = (val) =>
      typeof val === "string" ? val.trim() : undefined;

    if (trimIfString(city)) setPayload["location.city"] = trimIfString(city);
    if (trimIfString(state)) setPayload["location.state"] = trimIfString(state);
    if (trimIfString(county))
      setPayload["location.county"] = trimIfString(county);
    if (trimIfString(placeName))
      setPayload["location.placeName"] = trimIfString(placeName);

    // Coordinates validation
    // Coordinates validation
    if (rawCoordinates !== undefined) {
      if (!Array.isArray(rawCoordinates) || rawCoordinates.length !== 2) {
        return res
          .status(400)
          .json({ message: "coordinates must be [longitude, latitude]" });
      }

      const [longitude, latitude] = rawCoordinates.map(Number);

      if (
        Number.isNaN(longitude) ||
        Number.isNaN(latitude) ||
        longitude < -180 ||
        longitude > 180 ||
        latitude < -90 ||
        latitude > 90
      ) {
        return res.status(400).json({
          message:
            "coordinates are invalid. longitude must be -180..180 and latitude must be -90..90",
        });
      }

      // ❗ Store in lat/long order
      setPayload["location.coordinates"] = [latitude, longitude];
    }

    if (!Object.keys(setPayload).length) {
      return res.status(400).json({
        message:
          "Provide at least one location field: city, state, county, placeName, coordinates",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: setPayload },
      { new: true, runValidators: true },
    ).select("_id location");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User location updated",
      location: user.location,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  handleGetNearbyUsers,
  handleGetUserLocation,
  handleSetUserGeodata,
};
