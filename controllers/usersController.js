require("dotenv").config();
var crypto = require("crypto");

const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const status = require("http-status");
const bcrypt = require("bcrypt");
const Users = require("../models/User");
const Group = require("../models/groups");
const Creations = require("../models/generatedImages");
const Like = require("../models/likes");
const { APIresponse, APIErrorResponse } = require("../utils/APIResponse");
const APIError = require("../utils/APIError");
const {
  regSchema,
  loginSchema,
  profile,
  emailSchema,
  passwordResetSchema,
  passwordChangeSchema,
  addToCollectionSchema,
  updateCollectionSchema,
} = require("../utils/schema");
const { MESSAGES, SIGNUPMETHOD } = require("../utils/constants");
const queryString = require("query-string");
const {
  getAccessTokenFromCode,
  getGoogleUserInfo,
  getFBAccessTokenFromCode,
  getFacebookUserData,
  generateForgotPasswordToken,
} = require("../utils/functions");
const { sendEmail } = require("../utils/Email");
const likes = require("../models/likes");

const register = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password, cpassword } = req.body;

  const validate = regSchema.validate(req.body);
  if (validate.error) {
    return next(APIErrorResponse(res, validate.error.details[0].message));
  }
  const isExists = await Users.find({
    email: email,
  });

  if (isExists.length == 1) {
    return next(APIErrorResponse(res, MESSAGES.EMAIL_ALREADY_EXISTS));
  }

  const hash = await bcrypt.hash(password, 12);

  // Username
  var rand = crypto.randomBytes(20).toString("hex");
  var username = `${rand}-usr`;

  const data = await Users.insertMany(
    {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hash,
      userName: username,
      signupMethod: SIGNUPMETHOD.FORM,
    },
    {
      new: true,
    }
  );
  return APIresponse(res, MESSAGES.SUCCESS_MESSAGE, {
    user: data,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const loginValidation = loginSchema.validate(req.body);
  if (loginValidation.error) {
    return next(
      APIErrorResponse(res, loginValidation.error.details[0].message)
    );
  }
  var data = await Users.find({
    email: email,
  });
  if (data.length == 0) {
    return next(new APIErrorResponse(res, MESSAGES.CREDENTIALS_NOT_VALID));
  }
  let validatePassword = await bcrypt.compareSync(password, data[0].password);
  if (validatePassword) {
    const id = data[0]._id.toString();
    const jwtToken = jwt.sign(
      {
        id: id,
        email: data[0].email,
      },
      process.env.JWT_SECRET_KEY
    );
    return APIresponse(res, MESSAGES.SUCCESS_MESSAGE, {
      user: data,
      token: jwtToken,
    });
  }
  return next(APIErrorResponse(res, MESSAGES.CREDENTIALS_NOT_VALID));
});

const loginWithGoogle = catchAsync(async (req, res, next) => {
  const stringifiedParams = queryString.stringify({
    client_id: process.env.CLIENT_ID,
    redirect_uri: process.env.REDIRECT_URI,
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
  });

  const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;

  res.json(googleLoginUrl);
});

const auth = catchAsync(async (req, res, next) => {
  const { code } = req.query;
  var accessToken = await getAccessTokenFromCode(code);
  const getUserInfo = await getGoogleUserInfo(accessToken.access_token);

  var data = await Users.find({
    email: getUserInfo.data.email,
  });

  if (data.length == 0) {
    const hash = (Math.random() + 1).toString(36).substring(7);
    const data = new Users(
      {
        name: getUserInfo.data.name,
        email: getUserInfo.data.email,
        password: hash,
        signupMethod: SIGNUPMETHOD.GOOGLE,
      },
      {
        new: true,
      }
    );
    await data.save();
    const id = data[0]._id.toString();
    const jwtToken = jwt.sign(
      {
        id: id,
        email: getUserInfo.data.email,
      },
      process.env.JWT_SECRET_KEY
    );
    return APIresponse(res, MESSAGES.SUCCESS_MESSAGE, {
      user: data,
      token: jwtToken,
    });
  }

  if (data[0].email == getUserInfo.data.email) {
    return next(
      APIErrorResponse(res, MESSAGES.EMAIL_ALREADY_EXISTS, status.BAD_REQUEST)
    );
  }
  var data = await Users.find({
    email: getUserInfo.data.email,
    signupMethod: SIGNUPMETHOD.GOOGLE,
  });

  if (data.length == 0) {
    return next(
      APIErrorResponse(
        res,
        MESSAGES.LOGIN_USING_OTHER_METHODS,
        status.BAD_REQUEST
      )
    );
  }
  const id = data[0]._id.toString();
  const jwtToken = jwt.sign(
    {
      id: id,
      email: getUserInfo.data.email,
    },
    process.env.JWT_SECRET_KEY
  );
  return APIresponse(res, MESSAGES.SUCCESS_MESSAGE, {
    user: data,
    token: jwtToken,
  });
});

const loginWithFacebook = catchAsync(async (req, res, next) => {
  const stringifiedParams = queryString.stringify({
    client_id: process.env.FB_APP_ID,
    redirect_uri: process.env.FB_REDIRECT_URI,
    scope: ["email", "user_friends"].join(","),
    response_type: "code",
    auth_type: "rerequest",
    display: "popup",
  });

  const facebookLoginUrl = `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`;
  APIresponse(res, {
    url: facebookLoginUrl,
  });
});

const facebookAuth = catchAsync(async (req, res, next) => {
  const { code } = req.query;
  var accessToken = await getFBAccessTokenFromCode(code);
  const getUserInfo = await getFacebookUserData(accessToken);

  var data = await Users.find({
    email: getUserInfo.email,
  });

  if (data.length == 0) {
    const hash = (Math.random() + 1).toString(36).substring(7);
    const data = new Users(
      {
        name: getUserInfo.name,
        email: getUserInfo.email,
        password: hash,
        signupMethod: SIGNUPMETHOD.FACEBOOK,
      },
      {
        new: true,
      }
    );
    await data.save();
    const id = data[0]._id.toString();
    const jwtToken = jwt.sign(
      {
        id: id,
        email: getUserInfo.email,
      },
      process.env.JWT_SECRET_KEY
    );
    return APIresponse(res, MESSAGES.SUCCESS_MESSAGE, {
      user: data,
      token: jwtToken,
    });
  }

  if (data[0].email == getUserInfo.email) {
    return next(APIErrorResponse(res, MESSAGES.EMAIL_ALREADY_EXISTS));
  }
  var data = await Users.find({
    email: getUserInfo.email,
    signupMethod: SIGNUPMETHOD.FACEBOOK,
  });

  if (data.length == 0) {
    return next(APIErrorResponse(res, MESSAGES.LOGIN_USING_OTHER_METHODS));
  }
  const id = data[0]._id.toString();
  const jwtToken = jwt.sign(
    {
      id: id,
      email: getUserInfo.email,
    },
    process.env.JWT_SECRET_KEY
  );
  return APIresponse(res, MESSAGES.SUCCESS_MESSAGE, {
    user: data,
    token: jwtToken,
  });
});

const addProfilePicture = catchAsync(async (req, res, next) => {
  const { profilePicture } = req.files;

  if (!profilePicture) {
    return next(APIErrorResponse(res, MESSAGES.NO_FILES_SELECTED));
  }
  var rand = crypto.randomBytes(20).toString("hex");
  const fileName = `${rand}-${profilePicture.name}`;

  await profilePicture.mv("./public/uploads/" + fileName);
  const imageURL = `http://localhost:3000/uploads/${fileName}`;

  let data = await Users.findByIdAndUpdate(
    {
      _id: req.user.id,
    },
    {
      profilePicture: imageURL,
    },
    {
      new: true,
    }
  );
  return APIresponse(res, MESSAGES.SUCCESS_MESSAGE, {
    data: data,
  });
});

const updateProfile = catchAsync(async (req, res, next) => {
  const {
    first_name,
    last_name,
    phone,
    address,
    city,
    country,
    postcode,
    bio,
  } = req.body;

  const profileValidation = profile.validate(req.body);
  if (profileValidation.error) {
    return next(
      APIErrorResponse(res, profileValidation.error.details[0].message)
    );
  }

  let updateProfile = await Users.findByIdAndUpdate(
    { _id: req.user.id },
    {
      firstName: first_name,
      lastName: last_name,
      bio: bio,
      address: address,
      country: country,
      phone: phone,
      postCode: postcode,
      city: city,
    },
    {
      new: true,
    }
  );

  if (updateProfile) {
    return APIresponse(res, MESSAGES.SUCCESS_MESSAGE, {
      user: updateProfile,
    });
  }
  return next(APIErrorResponse(res, MESSAGES.NOT_SUCCESSFUL));
});

const getProfile = catchAsync(async (req, res, next) => {
  const userid = req.user.id;
  const profile = await Users.findById(userid);
  return APIresponse(res, MESSAGES.SUCCESS_MESSAGE, {
    user: profile,
  });
});

const forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const validateEmailSchema = emailSchema.validate(req.body);
  if (validateEmailSchema.error) {
    return next(
      APIErrorResponse(res, validateEmailSchema.error.details[0].message)
    );
  }
  const user = await Users.findById(req.user.id);

  if (user.email !== email) {
    return next(APIErrorResponse(res, MESSAGES.EMAIL_NOT_FOUND));
  }
  const token = await generateForgotPasswordToken();
  const currentDate = addMinutes(new Date(), 3);

  const userToken = await Users.findByIdAndUpdate(
    {
      _id: req.user.id,
    },
    {
      expiresIn: currentDate,
      token: token,
    },
    {
      new: true,
    }
  );
  const sendMail = await sendEmail(
    user[0].email,
    MESSAGES.EMAIL_FOR_FORGET_PASSWORD_RESET,
    MESSAGES.EMAIL_CONTENT(email, token)
  );
  if (sendMail instanceof APIError) {
    return next(sendMail);
  }
  return APIresponse(res, MESSAGES.EMAIL_SUCCESSFUL, {
    email: sendMail,
    token: token,
  });
});

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

const resetPassword = catchAsync(async (req, res, next) => {
  const { newPassword, token } = req.body;
  const newPasswordSchema = passwordResetSchema.validate(req.body);
  if (newPasswordSchema.error) {
    return next(
      APIErrorResponse(res, newPasswordSchema.error.details[0].message)
    );
  }
  const findToken = await Users.findOne({
    token: token,
    expiresIn: {
      $gte: new Date(),
    },
  });
  if (findToken == null) {
    return next((res, MESSAGES.TOKEN_NOT_VALID));
  }
  const hash = await bcrypt.hash(newPassword, 12);
  const passwordUpdate = await Users.findOneAndUpdate(
    { token: token },
    {
      token: "",
      expiresIn: new Date(),
      password: hash,
    },
    {
      new: true,
    }
  );
  return APIresponse(res, MESSAGES.PASSWORD_UPDATED_SUCCESSFUL, {
    data: passwordUpdate,
  });
});

const changePassword = catchAsync(async (req, res, next) => {
  const passwordValidation = passwordChangeSchema.validate(req.body);
  const { currentPassword, newPassword } = req.body;
  if (passwordValidation.error) {
    return next(
      APIErrorResponse(res, passwordValidation.error.details[0].message)
    );
  }
  const isExists = await Users.findOne({
    _id: req.user.id,
    email: req.user.email,
  });

  let validatePassword = await bcrypt.compareSync(
    currentPassword,
    isExists.password
  );

  if (!validatePassword) {
    return next(APIErrorResponse(res, MESSAGES.CREDENTIALS_NOT_VALID));
  }
  const hash = await bcrypt.hash(newPassword, 12);
  const updatePassword = await Users.findOneAndUpdate(
    {
      _id: req.user.id,
      email: req.user.email,
    },
    {
      password: hash,
    },
    {
      new: true,
    }
  );

  return APIresponse(res, MESSAGES.PASSWORD_UPDATED_SUCCESSFUL, {
    user: updatePassword,
  });
});

//groups
const createGroup = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const schemaCheck = addToCollectionSchema.validate(req.body);

  if (schemaCheck.error) {
    return next(APIErrorResponse(res, schemaCheck.error.details[0].message));
  }
  const upDate = await Group.insertMany(
    {
      name: name,
      userId: req.user.id,
    },
    {
      new: true,
    }
  );

  APIresponse(res, MESSAGES.SUCCESS_MESSAGE, {
    data: upDate,
  });
});

const deleteGroup = catchAsync(async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return next(APIErrorResponse(res, MESSAGES.ID_IS_REQUIRED));
  }
  const del = await Group.findByIdAndDelete({ _id: id });

  APIresponse(res, MESSAGES.SUCCESS_MESSAGE);
});

const updateGroup = catchAsync(async (req, res, next) => {
  const { id, name } = req.body;
  const schemaCheck = updateCollectionSchema.validate(req.body);

  if (schemaCheck.error) {
    return next(APIErrorResponse(res, schemaCheck.error.details[0].message));
  }
  const updatGroup = await Group.findByIdAndUpdate(
    { _id: id },
    {
      name: name,
    },
    { new: true }
  );

  APIresponse(res, MESSAGES.SUCCESS_MESSAGE, {
    data: updatGroup,
  });
});

const getAllCreationsById = catchAsync(async (req, res, next) => {
  const getUser = await Users.find({ userName: req.body.userName });
  if (getUser.length == 0) {
    return res.json("userNotFound");
  }

  const getAllCreations = await Creations.find({ userId: getUser[0]._id });
  APIresponse(res, MESSAGES.SUCCESS_MESSAGE, {
    data: getAllCreations,
    user: getUser,
  });
});

const getAllCreations = catchAsync(async (req, res, next) => {
  const all = await Creations.find().sort({ createdAt: -1 });

  APIresponse(res, MESSAGES.SUCCESS_MESSAGE, {
    data: all,
  });
});

const likeCreation = catchAsync(async (req, res, next) => {
  const { creationId } = req.body;
  if (!creationId) {
    return next(APIErrorResponse(res, "Creation Id is Required"));
  }
  const createe = await Like.insertMany({
    userId: req.user.id,
    creationId: creationId,
  });

  APIresponse(res, MESSAGES.SUCCESS_MESSAGE, {
    data: createe,
  });
});

const deleteLike = catchAsync(async (req, res, next) => {
  const { creationId } = req.body;
  if (!creationId) {
    return next(APIErrorResponse(res, "Creation Id is Required"));
  }
  const del = await likes.findOneAndDelete({
    creationId: creationId,
    userId: req.user.id,
  });
  APIresponse(res, MESSAGES.SUCCESS_MESSAGE);
});
module.exports = {
  register,
  login,
  loginWithGoogle,
  auth,
  loginWithFacebook,
  facebookAuth,
  addProfilePicture,
  updateProfile,
  getProfile,
  forgetPassword,
  resetPassword,
  changePassword,
  createGroup,
  deleteGroup,
  updateGroup,
  getAllCreationsById,
  getAllCreations,
  likeCreation,
  deleteLike,
};
