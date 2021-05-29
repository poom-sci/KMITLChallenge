const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: 'https://img.lovepik.com/free_png/32/23/59/70358PIC95iAmhU4dc0VY_PIC2018.png_860.png' ,
  },
  rank: {
    type: String,
    default: '1' ,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
    required: true,
  },
  history: {
    missions: [{ type: Object}],
    shops:[{type: Object}],
    rewards: [{ type: Object}],
  },
  friendsList: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
