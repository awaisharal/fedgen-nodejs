var express = require("express");
var router = express.Router();
var { register,login,loginWithGoogle,auth } = require("../controllers/usersController");


router.post("/register",register);
router.post("/login",login);
router.post("/loginWithGoogle",loginWithGoogle);
router.get("/auth",auth);

module.exports = router;
