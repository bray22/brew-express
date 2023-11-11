import mongoose from 'mongoose';

// Define the schema for the feedback
const feedbackSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: String,
  beerId: String,
  feedback: String,
  createDate: Date
});

// Create the feedback model
const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
