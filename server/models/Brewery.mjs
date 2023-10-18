import mongoose from 'mongoose';

// Define a Mongoose schema for the "Brewery" data
const brewerySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // This assumes you want to use the default ObjectId as the _id
  attributes: {
    type: String,
    url: String,
  },
  Id: String,
  Name: String,
  Parent: String, // Change to a reference to another model if applicable
  Phone: String,
  Website: String,
  Brewery_Type__c: String,
  BillingAddress: {
    city: String,
    country: String,
    countryCode: String,
    geocodeAccuracy: String,
    latitude: Number,
    longitude: Number,
    postalCode: String,
    state: String,
    stateCode: String,
    street: String,
  },
  Is_Craft_Brewery__c: Boolean,
  Voting_Member__c: Boolean,
  Membership_Record_Item__c: String,
  Membership_Record_Paid_Through_Date__c: Date,
  Membership_Record_Status__c: String,
  Account_Badges__c: String, // Change to an array if it holds multiple values
});

// Create a Mongoose model based on the schema
const Brewery = mongoose.model('Brewery', brewerySchema);

export default Brewery;