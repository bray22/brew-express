import express from "express";
import { ObjectId } from "mongodb";
import Session from "../models/Session.mjs";

const router = express.Router();

// update session with logged in user
router.put("/", async (req, res) => {
  const { sessionId, userId } = req.body;

  try {
    // Check if the session with the given sessionId exists
    const existingSession = await Session.findById(sessionId);

    if (!existingSession) {
      return res.status(404).send("Session not found");
    }

    // Update the existing session with the new userId
    existingSession.userId = userId;

    // Save the updated session
    const result = await existingSession.save();

    res.status(200).send(result);
  } catch (error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      // Handle duplicate key error (E11000)
      res.status(400).json({ error: "Duplicate key error. Session with the given ID already exists." });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Create a new session
router.post("/", async (req, res) => {
  const { 
    country, 
    zip
  } = req.body;

  try {
    const newSession = new Session();
    newSession._id = new ObjectId();
    newSession.country = country;
    newSession.zip = zip;
    newSession.createDate = new Date();

    const result = await newSession.save();
    res.status(201).send(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
