import mongoose from 'mongoose';

// Define the schema for the recent model
const recentSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  beerId: String,
  userId: String,
  sessionId: String,
  createDate: Date
});

// Create the recent model
const Recent = mongoose.model('Recent', recentSchema);

export default Recent;
