import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import User from "../models/User.mjs";
import * as sendgrid from '@sendgrid/mail';
import sgMail from '@sendgrid/mail'; // Change the import

const router = express.Router();

// Login route
router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Replace 'User' with the actual User model in your application
    const user = await User.findOne({ username, password });
    const returnUser = {
      "username": user.username,
      "firstName": user.firstName,
      "lastName": user.lastName
    }
    if (returnUser) {
      // User with the provided username and password exists

      res.status(200).send(returnUser);
    } else {
      // Authentication failed
      res.status(401).send("Authentication failed");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// reset password
router.post("/reset", async (req, res) => {
  const { email, server } = req.body;

  try {
    // Replace 'User' with the actual User model in your application
    sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Set the SendGrid API key using sgMail

    async function sendgridExample() {
       await sgMail.send({ // Use sgMail instead of sendgrid
         to: 'bray22@gmail.com',
         from: 'sipstr.ai@gmail.com',
         subject: 'Reset Email',
         text: 'reset you password.',
       });
    }

    sendgridExample();


    const returnObj = {email, server};

    res.status(200).send(returnObj);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
