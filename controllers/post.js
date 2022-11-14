require("dotenv").config();
const catchAsync = require("../utils/catchAsync");
const status = require("http-status");
const { APIErrorResponse } = require("../utils/APIResponse");
const Post = require("../models/post");
const { MESSAGES } = require("../utils/constants");
var crypto = require("crypto");

const createPost = catchAsync(async (req, res, next) => {
    const img = req.files
    if(!img){
        return next(
            APIErrorResponse(res,MESSAGES.NO_FILES_SELECTED)
        )
    }
    const description = req.body.description == null ? " " : req.body.description;

    var rand = crypto.randomBytes(20).toString("hex");
    const fileName = `${rand}-${img.name}`;
  
    await img.mv("./uploads/" + fileName);

    const save = await Post.insertMany({
        postImage : "/uploads/" + fileName,

    })
});

module.exports = {
    createPost
}