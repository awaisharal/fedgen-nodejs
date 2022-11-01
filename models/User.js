const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 16
  },
  email: {
    type: String,
    required: true,
    min: 3,
    max: 16,
    unique: true
  },
  password: {
    type: String,
    required: true,
    min: 4,
    max: 25
  }
},{ timestamps: true });

module.exports = mongoose.model('Users', UserSchema);
