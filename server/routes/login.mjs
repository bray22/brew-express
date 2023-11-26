import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import User from "../models/User.mjs";
import * as sendgrid from '@sendgrid/mail';
import sgMail from '@sendgrid/mail'; // Change the import

const router = express.Router();

// new user
router.post("/newUser", async (req, res) => {
  
  const {
   
    username,
    password,
    //firstName,
    //lastName,
    //email,
    //createDate,
   // updateDate,
  } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      // User with the provided username already exists
      res.status(409).send("Username already exists");
    } else {
      // Hash the password before saving it
     // const hashedPassword = await bcrypt.hash(password, 10);

      const objId = new ObjectId();
      
      // Create a new user instance
      const newUser = new User({
        _id: objId,
        username,
        password,
        //firstName,
       // lastName,
       // email,
       // createDate,
       // updateDate,
      });

      // Save the new user to the database
      await newUser.save();

      const returnUser = {
        userId: newUser._id,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      };

      // Respond with the new user data
      res.status(201).send(returnUser);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login route
router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Replace 'User' with the actual User model in your application
    const user = await User.findOne({ username });

    if (user && bcrypt.compareSync(password, user.password)) {
      const returnUser = {
        userId: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      };

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
