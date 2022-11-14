require("dotenv").config();
const catchAsync = require("../utils/catchAsync");
const status = require("http-status");
const { APIresponse } = require("../utils/APIResponse");
const APIError = require("../utils/APIError");
const Creations = require("../models/generatedImages");

const { MESSAGES } = require("../utils/constants");
var crypto = require("crypto");
const fs = require("fs");

const uploadImage = catchAsync(async (req, res, next) => {
  const { base64image, prompt } = req.body;
  const imgdata = base64image;
  if (!imgdata) {
    return next(new APIError(MESSAGES.NO_FILES_SELECTED, status.BAD_REQUEST));
  }
  var rand = crypto.randomBytes(20).toString("hex");
  const fileName = `${rand}+FedGen.png`;
  const path = "./public/uploads/" + fileName;
  const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, "");
  fs.writeFileSync(path, base64Data, { encoding: "base64" });
  const imageURL = `http://localhost:3000/uploads/${fileName}`;

  const data = await Creations.insertMany({
    prompt: prompt,
    userId: req.user.id,
    imageURL: imageURL,
  },{new : true});
  APIresponse(res, MESSAGES.SUCCESS_MESSAGE, {
    data: data,
  });
});

module.exports = {
  uploadImage,
};
