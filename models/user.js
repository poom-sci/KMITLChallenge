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
  avatar: {
    type: String,
    default: 'https://img.lovepik.com/free_png/32/23/59/70358PIC95iAmhU4dc0VY_PIC2018.png_860.png' ,
  },
});

module.exports = mongoose.model("User", userSchema);
