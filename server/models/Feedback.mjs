import mongoose from 'mongoose';
import User from './User.mjs';

// Define the schema for the Beer model
const feedbaackSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: String,
  feedback: String,
  createDate: Date
});

// Create the feedback/post model
const Feedback = mongoose.model('Feedback', feedbaackSchema);

export default Feedback;
