import express from "express";
import { ObjectId } from "mongodb";
import Recent from "../models/Recent.mjs";

const router = express.Router();

// Get recent beers by user ID, session ID
router.get("/:sessionId/:beerId", async (req, res) => {
  const { sessionId, beerId } = req.params;

  try {
    const result = await Recent.findOne({ sessionId, beerId });

    if (result) {
      console.log(result);
      // If a result is found (not null), it means the favorite exists
      res.status(200).json({ success: true, message: 'Recent viewed retrieved', favorite: result.favorite });
    } else {
      // If no result is found, it means the favorite does not exist
      res.status(404).json({ success: false, message: 'Recent viewed not found', favorite: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal Server Error', favorite: false });
  }
});

// Get recent beers by user ID, session ID
router.get("/:sessionId", async (req, res) => {
  const { userId, sessionId } = req.params;

  try {
    const result = await Recent.find({ sessionId });

    if (result) {
      // If a result is found (not null), it means the favorite exists
      res.send(result).status(200);
    } else {
      // If no result is found, it means the favorite does not exist
      res.status(404).json({ success: false, message: 'Recent viewed not found', favorite: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal Server Error', favorite: false });
  }
});

// Create a new recently viewed
router.post("/", async (req, res) => {
  const { 
    userId, 
    beerId,
    sessionId
  } = req.body;

  //const existingRecents = await Recent.findOne({ sessionId, beerId });
  //if (!existingRecents) {
    try {
      const newRecent = new Recent();
      newRecent._id = new ObjectId();
      newRecent.userId = userId;
      newRecent.beerId = beerId;
      newRecent.sessionId = sessionId;
      newRecent.createDate = new Date();

      const result = await newRecent.save();
      res.status(201).send(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  //} else {
   // console.log("Beer already exists in recents");
  //}
});

// Delete a user by ID
router.delete("/:sessionId/:beerId", async (req, res) => {
  const { sessionId, beerId } = req.params;

  try {
    const result = await Recent.deleteMany({ sessionId, beerId });
  
    if (result.deletedCount === 1) {
      res.status(200).json({ success: true, message: 'Favorite deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Favorite not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

export default router;
