require("dotenv").config()
const nodemailer = require("nodemailer")
const status = require("http-status")
const APIError = require("./APIError")
const { MESSAGES } = require("./constants")

exports.sendEmail = async (email, subject, link) => {
  var transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_USERPASSWORD
    }
  })
  let mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: email,
    subject: subject,
    html: link
  }
  const response = await transporter.sendMail(mailOptions)
  if (response.rejected.length > 0) {
    return new APIError(MESSAGES.EMAIL_UNSUCCESSFUL, status.BAD_REQUEST)
  }
  return MESSAGES.SUCCESS_MESSAGE
}
