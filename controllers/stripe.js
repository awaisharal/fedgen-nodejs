require("dotenv").config();
const catchAsync = require("../utils/catchAsync");
const Payment = require("../models/payments");
const Users = require("../models/User");
const { APIresponse, APIErrorResponse } = require("../utils/APIResponse");
const { MESSAGES } = require("../utils/constants");

const updatePaymentStatus = catchAsync(async (req, res, next) => {

  const { id } = req.body;
  const upDate = await Payment.findByIdAndUpdate(
    { _id: id },
    {
      paymentStatus: 1,
    },
    {
      new: true,
    }
  );
  const getData = await Users.findById({_id : upDate.userId})
  const updateCredits = await Users.findByIdAndUpdate({_id:upDate.userId},{
    credits : getData.credits + parseInt(upDate.creditsAmount)
  },{
    new : true
  })

  APIresponse(res,MESSAGES.SUCCESS_MESSAGE,{
    data : updateCredits
  })
});

module.exports = {
  updatePaymentStatus,
};
