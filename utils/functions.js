require('dotenv').config();
const axios = require("axios");


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