import mongoose from 'mongoose';

// Define the schema for the Beer model
const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  email: String,
  createDate: Date
});

// Create the Beer model
const User = mongoose.model('User', userSchema);

export default User;
