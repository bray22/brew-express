import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import Brewery from "../models/Brewery.mjs";

const router = express.Router();

// Get a list of 50 posts
router.get("/", async (req, res) => {
  let collection = await db.collection("breweries");
  let results = await collection.find({})
    .limit(50)
    .toArray();

  res.send(results).status(200);
});

// Fetches brewery by name
router.get("/name/:name", async (req, res) => {
  try {
    const nameQuery = req.params.name; // The string to search for at the beginning

    // Use a regular expression with the $regex operator to match names that start with nameQuery
    const result = await Brewery.find({ Name: { $regex: new RegExp(`^${nameQuery}`) } });

    if (result.length === 0) {
      res.status(404).send("Not found");
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single post
router.get("/:id", async (req, res) => {
  let collection = await db.collection("breweries");
  let query = {_id: ObjectId(req.params.id)};
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Add a new document to the collection
router.post("/", async (req, res) => {
  let collection = await db.collection("posts");
  let newDocument = req.body;
  newDocument.date = new Date();
  let result = await collection.insertOne(newDocument);
  res.send(result).status(204);
});

// Update the post with a new comment
router.patch("/comment/:id", async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };
  const updates = {
    $push: { comments: req.body }
  };

  let collection = await db.collection("posts");
  let result = await collection.updateOne(query, updates);

  res.send(result).status(200);
});

// Delete an entry
router.delete("/:id", async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };

  const collection = db.collection("posts");
  let result = await collection.deleteOne(query);

  res.send(result).status(200);
});

export default router;
