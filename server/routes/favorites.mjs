import express from "express";
import { ObjectId } from "mongodb";
import Favorites from "../models/Favorites.mjs";

const router = express.Router();

// Add a favorite
router.post("/", async (req, res) => {
  const { 
    userId, 
    beerId,
  } = req.body;

  const newFavorite = new Favorites();
  const objId = new ObjectId();

  newFavorite._id = objId;
  newFavorite.userId = userId;
  newFavorite.beerId = beerId;
  newFavorite.createDate = new Date();

  try {
    const result = await newFavorite.save();
    console.log(result);
    res.status(201).send(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:userId/:beerId", async (req, res) => {
  const { userId, beerId } = req.params;

  try {
    const result = await Favorites.deleteMany({ userId, beerId });
    console.log(result);

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
