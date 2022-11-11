require('dotenv').config();
const axios = require("axios");
var crypto = require("crypto");

exports.getAccessTokenFromCode = async (code) => {
  try{
    var data = await axios({
      url: `https://oauth2.googleapis.com/token`,
      method: "POST",
      data: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: "authorization_code",
        code,
      },
    });
    return data.data;
  }
  catch(err){
    console.log("axious",err)
  }
};


exports.getGoogleUserInfo =  async (access_token)=> {
  const  data  = await axios({
    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return data;
};


exports.getFBAccessTokenFromCode = async (code) =>{
  const { data } = await axios({
    url: 'https://graph.facebook.com/v4.0/oauth/access_token',
    method: 'GET',
    params: {
      client_id: process.env.FB_APP_ID,
      client_secret: process.env.FB_APP_SECRET,
      redirect_uri: process.env.FB_REDIRECT_URI,
      code,
    },
  });
  // console.log(data); // { access_token, token_type, expires_in }
  return data.access_token;
};



exports.getFacebookUserData = async(accesstoken) => {
  const { data } = await axios({
    url: 'https://graph.facebook.com/me',
    method: 'GET',
    params: {
      fields: ['id', 'email', 'first_name', 'last_name'].join(','),
      access_token: accesstoken,
    },
  });
  // console.log(data); 
  return data;
};

exports.generateForgotPasswordToken = async () =>{
  return crypto.randomBytes(16).toString("hex")
}