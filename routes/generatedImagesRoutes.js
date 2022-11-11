var express = require("express");
var router = express.Router();
const { authJwt } = require("../middlewares/authJWT");
var {
    uploadImage,

} = require("../controllers/genetaredImageCont");

router.post("/uploadImage",authJwt, uploadImage);


module.exports = router;
