import mongoose from 'mongoose';

// Define the schema for the session model
const sessionSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  country: String,
  zip: String,
  userId: String,
  createDate: Date
});

// Create the session model
const Session = mongoose.model('Session', sessionSchema);

export default Session;
