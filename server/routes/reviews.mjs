import express from "express";
import { ObjectId } from "mongodb";
import Review from "../models/Review.mjs";

const router = express.Router();

// Add a new review
router.post("/", async (req, res) => {
  const { 
    userId,
    beerId,
    review
  } = req.body;

  const objId = new ObjectId();
  const newReview = new Review();
  
  newReview._id = objId;
  newReview.userId = userId;
  newReview.beerId = beerId;
  newReview.review = review;
  newReview.createDate = new Date();

  try {
    const result = await newReview.save();
    console.log(result);
    res.status(201).send(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
