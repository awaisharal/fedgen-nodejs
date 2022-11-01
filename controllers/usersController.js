// Libraries
require("dotenv").config();
const jwt = require("jsonwebtoken");
const status = require("http-status");
const bcrypt = require("bcrypt");
const Users = require("../models/User");
const { APIresponse } = require("../utils/APIResponse");
const APIError = require("../utils/APIError");
const { regSchema, loginSchema } = require("../utils/schema");
const { MESSAGES } = require("../utils/constants");
const queryString = require("query-string");
const {
  getAccessTokenFromCode,
  getGoogleUserInfo,
} = require("../utils/functions");

const register = async (req, res, next) => {
  const { name, email, password, cpassword } = req.body;

  const validate = regSchema.validate(req.body);
  if (validate.error) {
    return next(
      new APIError(validate.error.details[0].message, status.BAD_REQUEST)
    );
  }

  const hash = await bcrypt.hash(password, 12);

  var data = new Users({
    name: name,
    email: email,
    password: hash,
  });
  const user = await data.save();

  return APIresponse(res, MESSAGES.SUCCESS_MESSAGE, {
    user: user,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const loginValidation = loginSchema.validate(req.body);
  if (loginValidation.error) {
    return next(
      new APIError(loginValidation.error.details[0].message, status.BAD_REQUEST)
    );
  }
  var data = await Users.find({
    email: email,
  });

  if (!data) {
    return next(
      new APIError(MESSAGES.CREDENTIALS_NOT_VALID, status.BAD_REQUEST)
    );
  }
  let validatePassword = await bcrypt.compareSync(password, data[0].password);
  if (validatePassword) {
    const jwtToken = jwt.sign(
      {
        id: data.id,
        email: data[0].email,
      },
      process.env.JWT_SECRET_KEY
    );
    return APIresponse(res, MESSAGES.SUCCESS_MESSAGE, {
      user: data,
      token: jwtToken,
    });
  }
  return next(new APIError(MESSAGES.CREDENTIALS_NOT_VALID, status.BAD_REQUEST));
};

const loginWithGoogle = async (req, res, next) => {
  const stringifiedParams = queryString.stringify({
    client_id: process.env.CLIENT_ID,
    redirect_uri: process.env.REDIRECT_URI,
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "), // space seperated string
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
  });

  const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;

  res.json(googleLoginUrl);
};

const auth = async (req, res, next) => {
  const { code } = req.query;
  var accessToken = await getAccessTokenFromCode(code);
  const getUserInfo = await getGoogleUserInfo(accessToken.access_token);

  res.json(getUserInfo.data);
};




module.exports = {
  register,
  login,
  loginWithGoogle,
  auth,

};
