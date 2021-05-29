const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const busSchema = new Schema({
  Bus_ID: {
    type: String,
    required: true,
  },
  location: {
    type: { type: String },
    coordinates: [],
  }
});

busSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Bus", busSchema);
