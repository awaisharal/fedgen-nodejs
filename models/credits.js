const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const creditSchema = new Schema(
  {
    title : {
      type: String,
      required: true,
    },
    price  : {
      type: String,
      required: true,
    },
    pricePerCredit   : {
      type: String,
      required: true,
    },
    stripePriceId : {
      type: String,
      required: false,
    },
    status  : {
      type: Number,
      required: true,
      default : 1
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Credit", creditSchema);
