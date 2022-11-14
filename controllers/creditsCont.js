require("dotenv").config();
const catchAsync = require("../utils/catchAsync");
const Credit = require("../models/credits");
const Payment = require("../models/payments");
const { APIresponse, APIErrorResponse } = require("../utils/APIResponse");
const { MESSAGES } = require("../utils/constants");
const {stripeSession} = require("../utils/stripe")

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

const createPayment = catchAsync(async(req,res,next)=>{
const {productId,firstName,lastName,email,phone,country,address,city,postcode,amountPaid,stripePriceId,creditsAmount}=req.body

const createePayment  = await Payment.insertMany({
  productId : productId,
  firstName : firstName,
  lastName: lastName,
  email: email,
  phone: phone,
  country : country,
  address : address,
  city : city,
  postcode : postcode,
  amountPaid : amountPaid,
  stripePriceId : stripePriceId,
  creditsAmount : creditsAmount,
  userId : req.user.id
},{
  new :true
})

const Session = await stripeSession(stripePriceId)

APIresponse (res,MESSAGES.SUCCESS_MESSAGE,{
  url : Session.url
})

})
module.exports = {
  createCredits,
  getAllCredits,
  getCreditById,
  createPayment,
};
