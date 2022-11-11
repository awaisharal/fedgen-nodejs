const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);
