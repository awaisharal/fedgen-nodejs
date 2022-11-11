const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentsSchema = new Schema(
  {
    commentDescription: {
      type: String,
      required: true,

    },
    userId :{
        type: String,
        required: true
    },
    postId : {
        type: String,
        required : true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comments", commentsSchema);
