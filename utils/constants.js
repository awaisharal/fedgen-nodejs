const MESSAGES = {
  EMAIL_ALREADY_EXISTS : "Email already exists",
  EMAIL_NOT_FOUND : "Email Not found",
  CREDENTIALS_NOT_VALID: "Credentials are not valid",
  SUCCESS_MESSAGE: "Successful",
  TOKEN_NOT_FOUND: "Token Not Found",
  NOT_SUCCESSFUL : "Not Successful",
  INTERNAL_ERROR : "Internal Server Error",
  LOGIN_USING_OTHER_METHODS : "Login through other methods",
  NO_FILES_SELECTED : "No file was Selected",
  TOKEN_NOT_VALID : "Token Not valid",
  EMAIL_FOR_FORGET_PASSWORD_RESET : "Email For Forget Password Reset",
  EMAIL_UNSUCCESSFUL : "Error in sending Email",
  EMAIL_CONTENT: function (email, token) {
    return `A password reset was requested for this email address ${email}.
    If you requested this reset, please 
    <a href="frontEndUrlHere/users/resetPassword?token=${token}">Reset Your Password</a>`
  },
  EMAIL_SUCCESSFUL : "Email Sent Successfully",
  PASSWORD_UPDATED_SUCCESSFUL : "Password Update Success",
  ID_IS_REQUIRED : "Id is a Required Field"

};
const SIGNUPMETHOD = {
  GOOGLE : "google",
  FORM : "form",
  FACEBOOK : "facebook"

}

module.exports = {
  MESSAGES,
  SIGNUPMETHOD
};
