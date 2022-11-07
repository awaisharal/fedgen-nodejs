const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const generatedImagesScehma = new Schema(
  {
    prompt: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("generatedImages", generatedImagesScehma);
