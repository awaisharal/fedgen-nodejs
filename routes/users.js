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
  changePassword
} = require("../controllers/usersController");

router.post("/register", register);
router.post("/login", login);
router.post("/loginWithGoogle", loginWithGoogle);
router.get("/auth", auth);
router.post("/loginWithFacebook", loginWithFacebook);
router.get("/facebookAuth", facebookAuth);
router.post("/addProfilePicture", authJwt, addProfilePicture);
router.post("/updateProfile", authJwt, updateProfile);
router.get("/userProfile",authJwt,getProfile)
router.post("/forgetPassword",authJwt,forgetPassword)
router.put("/resetPassword",resetPassword)
router.post("/changePassword",authJwt,changePassword)

module.exports = router;
