import mongoose from 'mongoose';

// Define the schema for the Beer model
const beerSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  nameDisplay: String,
  abv: String,
  styleId: Number,
  isOrganic: String,
  isRetired: String,
  brewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brewery',
  },
  labels: {
    icon: String,
    medium: String,
    large: String,
    contentAwareIcon: String,
    contentAwareMedium: String,
    contentAwareLarge: String,
  },
  status: String,
  statusDisplay: String,
  createDate: Date,
  updateDate: Date,
  style: {
    id: Number,
    categoryId: Number,
    category: {
      id: Number,
      name: String,
      createDate: Date,
    },
    name: String,
    shortName: String,
    description: String,
    createDate: Date,
    updateDate: Date,
  },
});

// Create the Beer model
const Beer = mongoose.model('Beer', beerSchema);

export default Beer;
