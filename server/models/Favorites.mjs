import mongoose from 'mongoose';

// Define the schema for the Beer model
const favoritesSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: String,
  beerId: String,
  favorite: Boolean,
  createDate: Date
});

// Create the feedback/post model
const Favorites = mongoose.model('Favorite', favoritesSchema);

export default Favorites;
