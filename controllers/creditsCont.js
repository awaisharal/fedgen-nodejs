require("dotenv").config();
const catchAsync = require("../utils/catchAsync");
const Credit = require("../models/credits");
const { APIresponse, APIErrorResponse } = require("../utils/APIResponse");
const { MESSAGES } = require("../utils/constants");

const createCredits = catchAsync(async (req, res, next) => {
  const { title, price, pricePerCredit, stripePriceId } = req.body;

  const create = await Credit.insertMany(
    {
      title: title,
      price: price,
      pricePerCredit: pricePerCredit,
      stripePriceId: stripePriceId,
    },{
        new : true
    }
  );
  APIresponse(res, MESSAGES.SUCCESS_MESSAGE, {
    data: create,
  });
});

const getAllCredits = catchAsync(async (req, res, next) => {
  const all = await Credit.find();
  APIresponse(res, MESSAGES.SUCCESS_MESSAGE, {
    data: all,
  });
});

const getCreditById = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  const all = await Credit.findById({_id:id});
  APIresponse(res, MESSAGES.SUCCESS_MESSAGE, {
    data: all,
  });
});

module.exports = {
  createCredits,
  getAllCredits,
  getCreditById,
};
