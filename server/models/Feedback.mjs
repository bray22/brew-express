import mongoose from 'mongoose';

// Define the schema for the Beer model
const feedbaackSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: User._id,
  feedback: String,
  createDate: Date
});

// Create the feedback/post model
const Feedback = mongoose.model('Feedback', feedbaackSchema);

export default Feedback;
