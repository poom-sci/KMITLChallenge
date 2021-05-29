const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stationSchema = new Schema({
  stationID: {
    type: String,
    required: true,
  },
  nameTH: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  areaTH: {
    type: String,
    required: true,
  },
  areaEN: {
    type: String,
    required: true,
  },
  stationType: {
    type: String,
    required: true,
  },
  location: {
    type: { type: String },
    coordinates: [],
  },
  AQILast: {
    type: Object,
    required: true,
  },
});

stationSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Station", stationSchema);
