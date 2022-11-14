var status = require("http-status")

exports.APIresponse = (res, successMsg, successData) => {
  return res.status(status.OK).json({
    success: true,
    message: successMsg,
    data: successData
  })
}
exports.APIErrorResponse = (res, errorMessage) => {
  return res.status(status.OK).json({
    success: false,
    message: errorMessage,
  })
}
