import mongoose from 'mongoose';

// Define the schema for the review model
const reviewSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: String,
  beerId: String,
  review: String,
  createDate: Date
});

// Create the review model
const Review = mongoose.model('Review', reviewSchema);

export default Review;
