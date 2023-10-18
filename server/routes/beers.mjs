import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import Beer from "../models/Beer.mjs";
import Brewery from "../models/Brewery.mjs";

const router = express.Router();

// Get a list of 50 posts
router.get("/", async (req, res) => {
  try {
    const results = await Beer.find().populate('brewerId').limit(5);
    res.status(200).send(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single post
router.get("/:id", async (req, res) => {
  try {
    const result = await Beer.findById(req.params.id);
    if (!result) {
      res.status(404).send("Not found");
    } else {
      res.status(200).send(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new document to the collection
router.post("/", async (req, res) => {
  const newBeer = new Beer(req.body);
  newBeer.date = new Date();

  try {
    const result = await newBeer.save();
    res.status(201).send(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update the beer by ID
router.patch("/:id", async (req, res) => {
  try {
    const result = await Beer.findByIdAndUpdate(req.params.id, { $push: { comments: req.body } });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an entry
router.delete("/:id", async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };

  const collection = db.collection("posts");
  let result = await collection.deleteOne(query);

  res.send(result).status(200);
});

export default router;
