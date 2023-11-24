import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import Beer from "../models/Beer.mjs";
import Brewery from "../models/Brewery.mjs";

const router = express.Router();

// Get a list of 50 posts
router.get("/", async (req, res) => {
  try {
    const results = await Beer.find().populate('brewerId').sort({ name: 1 }).limit(100);
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
  const { 
    name, 
    nameDisplay, 
    description,
    brewerId,
    image
  } = req.body;
  try {
    const updateFields = { 
      name, 
      nameDisplay, 
      description,
      brewerId,
      labels: {medium: image}
    };

    console.log(updateFields);

    const result = await Beer.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields }
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
    const result = await Beer.find({ name: { $regex: new RegExp(`^${nameQuery}`, 'i') } }).populate('brewerId').limit(10);

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
  const { 
    name, 
    nameDisplay, 
    description,
    brewerId
  } = req.body;

  let newBeer = new Beer();
  const objId = new ObjectId();

  newBeer._id = objId
  newBeer.name = name;
  newBeer.brewerId = brewerId;
  newBeer.cals = 100;
  newBeer.nameDisplay = nameDisplay;
  newBeer.description = description;
  newBeer.date = new Date();

  try {
    const result = await newBeer.save();
    console.log(result);
    res.status(201).send(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/getBeersByIds', async (req, res) => {
  try {
    const { beerIds } = req.body;

    // Check if beerIds is an array
    if (!Array.isArray(beerIds)) {
      return res.status(400).json({ error: 'beerIds must be an array' });
    }

    // Convert beerIds to ObjectId
    const objectIdArray = beerIds.map(id => new ObjectId(id));

    // Fetch beers by their IDs
    const results = await Beer.find({ _id: { $in: objectIdArray } }).populate('brewerId');

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// case-insensitive regex
router.post("/search", async (req, res) => {
  try {
    const { terms } = req.body;

    if (!Array.isArray(terms)) {
      return res.status(400).json({ error: "Terms must be an array" });
    }

    // case-insensitive regex
    const searchCriteria = {
      name: { $in: terms.map(term => new RegExp(`^${term}$`, 'i')) },
    };

    const results = await Beer.find(searchCriteria)
      .populate('brewerId')
      .sort({ name: 1 }) // 1 for ascending, -1 for descending
      .limit(100);

    res.status(200).send(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update the beer by ID
router.patch("/:id", async (req, res) => {
  console.log(req);
  try {
    const result = await Beer.findByIdAndUpdate(req.params.id, { $push: { comments: req.body } });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// delete beer
router.delete("/id/:id", async (req, res) => {
  console.log('req');
  const objectIdString = req.params.id;;
  const objId = new ObjectId(objectIdString);

  try {
    const query = { _id: objId };
    const collection = db.collection("beers");
    let result = await collection.deleteOne({ _id: objId });

    if (result.deletedCount === 1) {
      res.status(204).send(); // Send a "No Content" response to indicate success.
    } else {
      res.status(404).send("Record not found"); // Send a 404 status if the record doesn't exist.
    }
  } catch (error) {
    console.error("Error deleting beer:", error);
    res.status(500).send("Internal Server Error"); // Send a 500 status for server errors.
  }
});


export default router;
