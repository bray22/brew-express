import express from "express";
import db from "../db/conn.mjs";
import passport from "passport";
import fetch from 'node-fetch';

const router = express.Router();
async function signUp(code, res) {
  
  const url = `https://oauth2.googleapis.com/token?code=${code}&client_id=${YOUR_CLIENT_ID}&client_secret=${YOUR_CLIENT_SECRET}&redirect_uri=http://localhost:3001/google&grant_type=authorization_code`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  console.log("data : ", data);

  // get the id token from the response
  const { id_token } = data;

  // verify the id token
  const verifyResponse = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`
  );

  const verifyData = await verifyResponse.json();
  console.log("verifyData : ", verifyData);

  // get the user data from the verify data
  const { name, email, picture } = verifyData;

  // This res.send is the key to redirecting back to our expo go app.
// ex: you have to enter your IP adress that is running your expo go application.
  res.send(`<script>window.location.replace("exp://?email=${email}&name=${name}&picture=${picture}")</script>`);

}



router.get("/", async (req, res) => {
 console.log("req.query : ", req.query);

  // use the code to get the access token

  const { code } = req.query;

  if (!code) {
    return res.status(400).json({
      error: "invalid code",
    });
  }

  signUp(code, res);

});

export default router;
