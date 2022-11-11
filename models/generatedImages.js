const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const generatedImageSchema = new Schema(
  {
    prompt: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Number,
      required: true,
      default: 0,
    },
    userId: {
      type: String,
      required: true,
    },
    collectionId: {
      type: String,
      required: true,
      default: "null",
    },
    imageURL: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Creations", generatedImageSchema);
