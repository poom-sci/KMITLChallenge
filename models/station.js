const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stationSchema = new Schema({
  station_ID: {
    type: String,
    required: true,
  },
  station_name: {
    type: String,
    required: true,
  },
  location: {
    type: { type: String },
    coordinates: [],
  },
  bus_pass: [],
});

stationSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Station", stationSchema);
