const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likesSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    creationId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Like", likesSchema);
