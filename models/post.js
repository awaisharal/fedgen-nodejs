const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postScehma = new Schema(
  {
    postImage: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postScehma);
