const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 3,
      max: 16,
    },
    lastName: {
      type: String,
      required: true,
      min: 3,
      max: 16,
    },
    bio: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      min: 3,
      max: 16,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 4,
      max: 25,
    },
    signupMethod: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    postCode: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    credits: {
      type: Number,
      required: true,
      default: 10,
    },
    profilePicture: {
      type: String,
      required: false,
    },
    token: {
      type: String,
      required: false,
    },
    expiresIn: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", UserSchema);
