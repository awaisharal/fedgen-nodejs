var express = require("express");
var router = express.Router();
const { authJwt } = require("../middlewares/authJWT");
var {
  register,
  login,
  loginWithGoogle,
  auth,
  facebookAuth,
  loginWithFacebook,
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
} = require("../controllers/usersController");

const {  createCredits,
  getAllCredits,
  getCreditById,createPayment
} = require("../controllers/creditsCont")
//login
router.post("/register", register);
router.post("/login", login);
router.post("/loginWithGoogle", loginWithGoogle);
router.get("/auth", auth);
router.post("/loginWithFacebook", loginWithFacebook);
router.get("/facebookAuth", facebookAuth);
router.post("/addProfilePicture", authJwt, addProfilePicture);
router.post("/updateProfile", authJwt, updateProfile);
router.get("/userProfile", authJwt, getProfile);
router.post("/forgetPassword", authJwt, forgetPassword);
router.put("/resetPassword", resetPassword);
router.post("/changePassword", authJwt, changePassword);
//group
router.post("/createGroup", authJwt, createGroup);
router.post("/deleteGroup", authJwt, deleteGroup);
router.post("/updateGroup", authJwt, updateGroup);
router.post("/getAllCreationsById", getAllCreationsById);
router.get("/getAllCreations", getAllCreations);
router.post("/likeCreation", authJwt, likeCreation);
router.post("/deleteLike", authJwt, deleteLike);

//credits 
router.post("/createCredits", authJwt, createCredits);
router.get("/getAllCredits", authJwt, getAllCredits);
router.post("/getCreditById", authJwt, getCreditById);
router.post("/createPayment", authJwt, createPayment);
module.exports = router;
