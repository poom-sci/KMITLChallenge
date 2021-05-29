const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const missionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imagesUrl: [],
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    point: {
      type: Number,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mission", missionSchema);
