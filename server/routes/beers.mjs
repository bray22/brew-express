import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import Beer from "../models/Beer.mjs";
import Brewery from "../models/Brewery.mjs";

const router = express.Router();

// Get a list of 50 posts
router.get("/", async (req, res) => {
  try {
    const results = await Beer.find().populate('brewerId').limit(100);
    res.status(200).send(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single beer
router.get("/id/:id", async (req, res) => {
  console.log(req);
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

// Update a beer by its ID
router.patch("/id/:id", async (req, res) => {
  const { brewerId } = req.body;
  try {
    console.log(req.params.id);
    console.log(req);
     const result = await Beer.findByIdAndUpdate(
        req.params.id, 
       { $set: { brewerId: brewerId } }, // Replace yourField and newValue
      { new: true } // This option returns the updated document
    );
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetches brewery by name
router.get("/name/:name", async (req, res) => {
  try {
    const nameQuery = req.params.name; // The string to search for at the beginning

    // Use a regular expression with the $regex operator to match names that start with nameQuery
    const result = await Beer.find({ Name: { $regex: new RegExp(`^${nameQuery}`) } }).limit(100);

    if (result.length === 0) {
      res.status(404).send("Not found");
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new beer
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
