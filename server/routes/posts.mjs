import express from "express";
import { ObjectId } from "mongodb";
import Feedback from "../models/Feedback.mjs";

const router = express.Router();

// Add a new feedback
router.post("/", async (req, res) => {
  const { 
    userId,
    beerId,
    feedback
  } = req.body;

  const newFeedback = new Feedback();
  const objId = new ObjectId();

  newFeedback._id = objId;
  newFeedback.userId = userId;
  newFeedback.beerId = beerId;
  newFeedback.feedback = feedback;
  newFeedback.createDate = new Date();

  try {
    const result = await newFeedback.save();
    console.log(result);
    res.status(201).send(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
