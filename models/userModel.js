const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: false,
      unique: true
    },
    mobile: {
      type: String,
      required: false,
      unique: true
    },
    email: {
      type: String,
      required: false,
      unique: true
    },
    fullname: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model('user', userSchema);
module.exports = user;
