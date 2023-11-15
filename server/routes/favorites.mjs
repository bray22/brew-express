import express from "express";
import { ObjectId } from "mongodb";
import Favorites from "../models/Favorites.mjs";

const router = express.Router();

router.get("/:userId/:beerId", async (req, res) => {
  const { userId, beerId } = req.params;

  try {
    const result = await Favorites.findOne({ userId, beerId });

    if (result) {
      console.log(result);
      // If a result is found (not null), it means the favorite exists
      res.status(200).json({ success: true, message: 'Favorite retrieved', favorite: result.favorite });
    } else {
      // If no result is found, it means the favorite does not exist
      res.status(404).json({ success: false, message: 'Favorite not found', favorite: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal Server Error', favorite: false });
  }
});



// Add or update a favorite
router.put("/", async (req, res) => {
  const { userId, beerId, favorite } = req.body;

  try {
    // Check if a record with the given userId and beerId already exists
    const existingFavorite = await Favorites.findOne({ userId, beerId });

    if (existingFavorite) {
      // Update the existing record
      existingFavorite.favorite = favorite;
      existingFavorite.createDate = new Date();

      const updatedResult = await existingFavorite.save();
      console.log(updatedResult);
      res.status(200).json(updatedResult);
    } else {
      // Create a new favorite
      const objId = new ObjectId();
      const newFavorite = new Favorites({
        _id: objId,
        userId,
        beerId,
        favorite,
        createDate: new Date(),
      });

      const result = await newFavorite.save();
      console.log(result);
      res.status(201).json(result);
    }
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
